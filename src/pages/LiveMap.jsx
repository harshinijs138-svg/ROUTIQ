import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layers, Search, X } from 'lucide-react';
import MapPanel from '../components/MapPanel';
import { StatusPill, DataLabel, Button } from '../components/ui';
import { useApp } from '../hooks/useApp';
import { formatEta } from '../utils/risk';
import { states } from '../data/districts';
import { hubs } from '../data/hubs';
import { ago } from '../utils/format';

export default function LiveMap() {
  const { vehicles, incidents, routes } = useApp();
  const [params] = useSearchParams();
  const [layers, setLayers] = useState({ vehicles: true, routes: true, incidents: true, accessibility: false, hubs: false, labels: true });
  const [selected, setSelected] = useState(null);
  const [focus, setFocus] = useState(null);
  const [q, setQ] = useState('');
  const [layerOpen, setLayerOpen] = useState(false);
  const fid = params.get('focus');

  useEffect(() => {
    if (!fid) return;
    const inc = incidents.find((i) => i.id === fid);
    const veh = vehicles.find((v) => v.id === fid);
    if (inc) { setSelected({ kind: 'incident', id: inc.id }); setFocus({ lat: inc.lat, lng: inc.lng, zoom: 10 }); }
    else if (veh) { setSelected({ kind: 'vehicle', id: veh.id }); setFocus({ lat: veh.pos[0], lng: veh.pos[1], zoom: 10 }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fid, incidents.length, vehicles.length]);

  const candidates = useMemo(() => [
    ...states.map((s) => ({ label: s.name, sub: 'State', lat: s.lat, lng: s.lng, zoom: 8 })),
    ...hubs.map((h) => ({ label: h.name, sub: 'Hub', lat: h.lat, lng: h.lng, zoom: 10 })),
    ...vehicles.map((v) => ({ label: v.id, sub: v.type, lat: v.pos[0], lng: v.pos[1], zoom: 10, sel: { kind: 'vehicle', id: v.id } })),
    ...incidents.map((i) => ({ label: i.title, sub: i.location, lat: i.lat, lng: i.lng, zoom: 10, sel: { kind: 'incident', id: i.id } })),
  ], [vehicles, incidents]);
  const matches = q.trim() ? candidates.filter((c) => `${c.label} ${c.sub}`.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6) : [];
  const pick = (c) => { setFocus({ lat: c.lat, lng: c.lng, zoom: c.zoom }); if (c.sel) setSelected(c.sel); setQ(''); };

  const toggle = (k) => setLayers((l) => ({ ...l, [k]: !l[k] }));
  const pills = [['vehicles', 'Vehicles'], ['routes', 'Routes'], ['incidents', 'Incidents'], ['accessibility', 'Accessibility']];

  const inc = selected?.kind === 'incident' ? incidents.find((i) => i.id === selected.id) : null;
  const veh = selected?.kind === 'vehicle' ? vehicles.find((v) => v.id === selected.id) : null;
  const rt = selected?.kind === 'route' ? routes.find((r) => r.id === selected.id) : null;

  return (
    <div className="map-page">
      <MapPanel layers={layers} focus={focus} selected={selected} onSelect={setSelected} />
      <div className="map-top">
        <div className="map-search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search location..." aria-label="Search location, vehicle or incident"
            onKeyDown={(e) => e.key === 'Enter' && matches[0] && pick(matches[0])} />
          {matches.length > 0 && (
            <ul className="suggest" role="listbox">
              {matches.map((m) => <li key={`${m.label}${m.sub}`}><button onClick={() => pick(m)}><strong>{m.label}</strong><span>{m.sub}</span></button></li>)}
            </ul>
          )}
        </div>
        <div className="pills" role="group" aria-label="Map filters">
          {pills.map(([k, l]) => <button key={k} className={`fpill ${layers[k] ? 'on' : ''}`} aria-pressed={layers[k]} onClick={() => toggle(k)}>{l}</button>)}
          <div className="menu">
            <button className="fpill" aria-expanded={layerOpen} onClick={() => setLayerOpen(!layerOpen)}><Layers size={14} /> Layers</button>
            {layerOpen && (
              <div className="menu-pop layer-pop">
                <label className="check"><input type="checkbox" checked={layers.hubs} onChange={() => toggle('hubs')} /> Logistics hubs</label>
                <label className="check"><input type="checkbox" checked={layers.labels} onChange={() => toggle('labels')} /> State names</label>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="map-badge"><DataLabel>Simulated GPS · Demo Data</DataLabel></div>

      {selected && (inc || veh || rt) && (
        <div className="map-detail" role="dialog" aria-label="Details">
          <button className="icon-btn close" aria-label="Close details" onClick={() => setSelected(null)}><X size={16} /></button>
          {inc && (<>
            <StatusPill level={inc.severity} />
            <h3>{inc.title}</h3>
            <p className="muted">{inc.type} · {inc.location} · {ago(inc.minutesAgo)}</p>
            <p>{inc.desc}</p>
            {inc.routeId && <Button as={Link} to={`/app/routes/${inc.routeId}`} size="sm" variant="secondary">View Route {inc.routeId}</Button>}
          </>)}
          {veh && (<>
            <StatusPill level={veh.status === 'Delayed' ? 'high' : 'medium'}>{veh.status}</StatusPill>
            <h3>{veh.id} · {veh.type}</h3>
            <p className="muted">{veh.origin} → {veh.destination}</p>
            <p>{veh.speed} km/h · ETA {formatEta(veh.etaMin)} · Risk {veh.risk}</p>
            <p className="muted small">Simulated GPS</p>
            <Button as={Link} to="/app/vehicles" size="sm" variant="secondary">Open Vehicles</Button>
          </>)}
          {rt && (<>
            <StatusPill level={rt.level} />
            <h3>{rt.name}</h3>
            <p className="muted">{rt.from} → {rt.to} · {rt.via}</p>
            <p>{rt.risk}% risk · {rt.accessibility}% accessibility · ETA {formatEta(rt.eta)}</p>
            <Button as={Link} to={`/app/routes/${rt.id}`} size="sm" variant="secondary">View Details</Button>
          </>)}
        </div>
      )}
    </div>
  );
}
