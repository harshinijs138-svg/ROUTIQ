import { Fragment, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../hooks/useApp';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { states } from '../data/districts';
import { hubs } from '../data/hubs';
import { clamp } from '../utils/risk';

export const LEVEL_COLOR = { low: '#1f8a4c', medium: '#c98a12', high: '#d9480f', critical: '#c62828' };
const mk = (html, cls, size) => L.divIcon({ html, className: cls, iconSize: size, iconAnchor: [size[0] / 2, size[1] / 2] });

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => { if (target) map.flyTo([target.lat, target.lng], target.zoom || 10, { duration: 0.8 }); }, [target, map]);
  return null;
}
function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => map.invalidateSize()) : null;
    ro?.observe(el);
    const t = setTimeout(() => map.invalidateSize(), 120);
    return () => { ro?.disconnect(); clearTimeout(t); };
  }, [map]);
  return null;
}

const DEFAULT_LAYERS = { vehicles: true, routes: true, incidents: true, accessibility: false, hubs: false, labels: true };

export default function MapPanel({ layers = DEFAULT_LAYERS, compact = false, focus, selected, onSelect, highlightRouteId, height = '100%' }) {
  const { routes, vehicles, incidents } = useApp();
  const small = useMediaQuery('(max-width: 700px)');
  const [tileFail, setTileFail] = useState(false);
  const L_ = { ...DEFAULT_LAYERS, ...layers };

  const overall = routes.length ? Math.round(routes.reduce((s, r) => s + r.accessibility, 0) / routes.length) : 70;
  const zones = useMemo(() => states.map((s) => {
    const near = incidents.filter((i) => Math.hypot(i.lat - s.lat, i.lng - s.lng) < 1.2);
    const pen = near.reduce((n, i) => n + (['critical', 'high'].includes(i.severity) ? 16 : 6), 0);
    return { ...s, score: clamp(overall + 8 - pen) };
  }), [incidents, overall]);

  const center = compact ? [25.9, 91.95] : [26.0, 92.6];
  const zoom = compact ? 9 : small ? 6 : 7;

  return (
    <div className="map-shell" style={{ height }}>
      <MapContainer
        center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}
        zoomControl={!compact} dragging={!compact} scrollWheelZoom={!compact} doubleClickZoom={!compact} touchZoom={!compact} keyboard={!compact}
        attributionControl={!compact}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: () => setTileFail(true), tileload: () => setTileFail(false) }}
        />
        <AutoResize />
        <FlyTo target={focus} />

        {L_.accessibility && zones.map((z) => (
          <Circle key={z.name} center={[z.lat, z.lng]} radius={70000}
            pathOptions={{ color: LEVEL_COLOR[z.score < 35 ? 'critical' : z.score < 55 ? 'high' : z.score < 75 ? 'medium' : 'low'], fillOpacity: 0.16, weight: 1 }} />
        ))}

        {L_.labels && !compact && states.map((s) => (
          <Marker key={s.name} position={[s.lat, s.lng]} interactive={false} keyboard={false}
            icon={mk(`<span>${s.name}</span>`, 'state-label', [110, 18])} />
        ))}

        {L_.hubs && hubs.map((h) => (
          <Marker key={h.id} position={[h.lat, h.lng]} title={h.name} icon={mk('<span class="hub"></span>', 'pin', [14, 14])} />
        ))}

        {L_.routes && routes.map((r) => {
          const active = highlightRouteId ? r.id === highlightRouteId : selected?.id === r.id;
          const dim = highlightRouteId && !active;
          const mid = r.path[Math.floor(r.path.length / 2)];
          return (
            <Fragment key={r.id}>
              <Polyline positions={r.path} pathOptions={{ color: LEVEL_COLOR[r.level], weight: active ? 8 : 4, opacity: dim ? 0.3 : 0.85 }}
                eventHandlers={{ click: () => onSelect?.({ kind: 'route', id: r.id }) }} />
              {!compact && <Marker position={mid} icon={mk(`<span>${r.id}</span>`, 'route-tag', [24, 24])} eventHandlers={{ click: () => onSelect?.({ kind: 'route', id: r.id }) }} />}
            </Fragment>
          );
        })}

        {L_.incidents && incidents.map((i) => (
          <Marker key={i.id} position={[i.lat, i.lng]} title={i.title}
            icon={mk(`<span class="inc inc-${i.severity}${selected?.id === i.id ? ' sel' : ''}">!</span>`, 'pin', [26, 26])}
            eventHandlers={{ click: () => onSelect?.({ kind: 'incident', id: i.id }) }} />
        ))}

        {L_.vehicles && vehicles.filter((v) => !v.delivered).map((v) => (
          <Marker key={v.id} position={v.pos} title={`${v.id} · Simulated GPS`}
            icon={mk(`<span class="veh veh-${v.status.toLowerCase()}${selected?.id === v.id ? ' sel' : ''}"></span>${compact ? '' : `<span class="veh-label">${v.id}</span>`}`, 'pin', [18, 18])}
            eventHandlers={{ click: () => onSelect?.({ kind: 'vehicle', id: v.id }) }} />
        ))}
      </MapContainer>
      {tileFail && (
        <div className="map-msg" role="status">Map tiles could not load. Routes, vehicles and incidents are still shown.</div>
      )}
    </div>
  );
}
