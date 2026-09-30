import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { Card, StatusPill, Button } from './ui';
import { formatEta } from '../utils/risk';
import { ago } from '../utils/format';

export function RouteCard({ route, recommended, selected, onToggle, compareMode }) {
  return (
    <Card className={`route-card ${selected ? 'is-selected' : ''}`}>
      <div className="row between">
        <h3>{route.name}</h3>
        {recommended ? <span className="tag-rec">Recommended</span> : <StatusPill level={route.level} />}
      </div>
      <p className="muted">{route.from} → {route.to}</p>
      <div className="route-nums">
        <div><div className={`big num-${route.level}`}>{route.risk}%</div><div className="cap">Risk</div></div>
        <div><div className="big">{route.accessibility}%</div><div className="cap">Accessibility</div></div>
        <div><div className="big sm">{formatEta(route.eta)}</div><div className="cap">ETA</div></div>
      </div>
      <p className="muted small">{route.via}</p>
      <div className="row gap">
        <Button as={Link} to={`/app/routes/${route.id}`} variant="secondary" size="sm">View Details</Button>
        {compareMode && (
          <label className="check">
            <input type="checkbox" checked={selected} onChange={() => onToggle(route.id)} /> Compare
          </label>
        )}
      </div>
    </Card>
  );
}

export function VehicleCard({ vehicle, onClick, active }) {
  const tone = vehicle.status === 'Delayed' ? 'high' : vehicle.status === 'Delivered' ? 'low' : 'medium';
  return (
    <button className={`vehicle-row ${active ? 'is-selected' : ''}`} onClick={onClick}>
      <div className="v-main">
        <strong>{vehicle.id}</strong>
        <span>{vehicle.type}</span>
        <span className="muted"><MapPin size={13} /> {vehicle.origin} → {vehicle.destination}</span>
      </div>
      <div className="v-meta">
        <StatusPill level={tone}>{vehicle.status === 'Moving' ? 'Moving' : vehicle.status}</StatusPill>
        <span>{vehicle.speed} km/h</span>
        <span className="muted"><Clock size={13} /> {vehicle.status === 'Delivered' ? 'Delivered' : `ETA ${formatEta(vehicle.etaMin)}`}</span>
      </div>
    </button>
  );
}

export function AlertCard({ alert, compact }) {
  const to = alert.focus ? `/app/map?focus=${alert.focus}` : '/app/map';
  return (
    <div className={`alert-row sev-${alert.severity}`}>
      <StatusPill level={alert.severity} />
      <div className="alert-main">
        <strong>{alert.title}</strong>
        <span className="muted">{alert.place} · {ago(alert.minutesAgo)}</span>
      </div>
      {!compact && <Button as={Link} to={to} variant="ghost" size="sm">View on Map <ArrowRight size={14} /></Button>}
    </div>
  );
}
