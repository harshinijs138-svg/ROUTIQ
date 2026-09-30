import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button, Card, EmptyState, PageHeader, ProgressBar, StatusPill } from '../components/ui';
import MapPanel from '../components/MapPanel';
import { AlertCard } from '../components/cards';
import { useApp } from '../hooks/useApp';
import { explain, formatEta } from '../utils/risk';
import { ago } from '../utils/format';

export default function RouteDetail() {
  const { id } = useParams();
  const { routes, recommended, incidents } = useApp();
  const route = routes.find((r) => r.id === id);
  if (!route) return <div className="page"><EmptyState title="Route not found" text="Choose a route from the list." action={<Button as={Link} to="/app/routes">Back to routes</Button>} /></div>;
  const isBest = recommended?.id === route.id;
  const mine = incidents.filter((i) => i.routeId === route.id);
  const reasons = isBest ? explain(route, routes.filter((r) => r.id !== route.id).sort((a, b) => b.risk - a.risk)[0]) : explain(recommended, route);

  return (
    <div className="page">
      <Link to="/app/routes" className="back"><ArrowLeft size={15} /> All routes</Link>
      <PageHeader title={route.name} subtitle={route.via} actions={<StatusPill level={route.level}>{route.level.toUpperCase()} RISK</StatusPill>} />
      <div className="split">
        <Card>
          <dl className="facts wide">
            <div><dt>Origin</dt><dd>{route.from}</dd></div>
            <div><dt>Destination</dt><dd>{route.to}</dd></div>
            <div><dt>Distance</dt><dd>{route.distance} km</dd></div>
            <div><dt>ETA</dt><dd>{formatEta(route.eta)}</dd></div>
            <div><dt>Risk</dt><dd className={`num-${route.level}`}>{route.risk}%</dd></div>
            <div><dt>Accessibility</dt><dd>{route.accessibility}%</dd></div>
          </dl>
          <h3>Conditions</h3>
          <div className="stack">
            <ProgressBar label="Rainfall" value={Math.round(route.factors.rainfall)} kind="risk" />
            <ProgressBar label="Flood" value={Math.round(route.factors.flood)} kind="risk" />
            <ProgressBar label="Landslide" value={Math.round(route.factors.landslide)} kind="risk" />
            <ProgressBar label="Traffic" value={Math.round(route.factors.traffic)} kind="risk" />
          </div>
        </Card>
        <Card className="map-card"><MapPanel compact highlightRouteId={route.id} height="100%" /></Card>
      </div>
      <div className="split">
        <Card>
          <h2>Current incidents</h2>
          {mine.length === 0 ? <p className="muted">No active incidents on this route.</p> : (
            <div className="stack">{mine.map((i) => <AlertCard key={i.id} compact alert={{ id: i.id, severity: i.severity, title: i.title, place: i.location, minutesAgo: i.minutesAgo }} />)}</div>
          )}
        </Card>
        <Card>
          <h2>Recommendation</h2>
          {isBest ? <p>ROUTIQ recommends <strong>{route.name}</strong> for {route.from} → {route.to}.</p>
            : <p>ROUTIQ recommends <strong>{recommended.name}</strong> ({recommended.risk}% risk, {recommended.accessibility}% accessibility, ETA {formatEta(recommended.eta)}) instead.</p>}
          <h3>Why?</h3>
          <ul className="checks big">{reasons.map((x) => <li key={x}><Check size={16} /> {x}</li>)}</ul>
          <p className="muted small">Rule-based risk analysis · Demo / Simulated Data</p>
          {!isBest && <Button as={Link} to={`/app/routes?compare=${route.id},${recommended.id}`} variant="secondary">Compare with {recommended.name}</Button>}
        </Card>
      </div>
    </div>
  );
}
