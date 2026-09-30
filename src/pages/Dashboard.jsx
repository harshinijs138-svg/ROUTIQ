import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import { Button, Card, MetricCard, Modal, StatusPill } from '../components/ui';
import { AlertCard } from '../components/cards';
import MapPanel from '../components/MapPanel';
import { useApp } from '../hooks/useApp';
import { explain, formatEta } from '../utils/risk';

const phrase = { rainfall: 'heavy rainfall', flood: 'flood exposure', landslide: 'landslide exposure' };
function describe(route) {
  const hits = ['rainfall', 'flood', 'landslide'].filter((k) => route.factors[k] >= 50).map((k) => phrase[k]);
  if (!hits.length) return 'No major hazards on this route. Conditions are stable.';
  const text = hits.length > 1 ? `${hits.slice(0, -1).join(', ')} and ${hits[hits.length - 1]}` : hits[0];
  return `${text[0].toUpperCase()}${text.slice(1)} detected.`;
}

export default function Dashboard() {
  const { routes, recommended, vehicles, deliveries, alerts } = useApp();
  const navigate = useNavigate();
  const [why, setWhy] = useState(false);
  if (!routes.length || !recommended) return null;
  const top = [...routes].sort((a, b) => b.risk - a.risk)[0];
  const other = top.id !== recommended.id ? top : routes.find((r) => r.id !== recommended.id);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const atRisk = routes.filter((r) => r.risk >= 50).length;
  const critical = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="page">
      <div className="welcome">
        <p className="muted">{greeting}.</p>
        <h1>Here&apos;s what needs your attention.</h1>
        <p className="sub">Monitor your network and act on the most important changes.</p>
      </div>

      <div className="kpis">
        <MetricCard label="Active Vehicles" value={vehicles.filter((v) => !v.delivered).length} />
        <MetricCard label="Deliveries" value={deliveries.length} />
        <MetricCard label="Routes at Risk" value={atRisk} tone={atRisk ? 'critical' : undefined} />
        <MetricCard label="Critical Alerts" value={critical} tone={critical ? 'critical' : undefined} />
      </div>

      <div className="split">
        <Card className="attention">
          <h2>What needs attention?</h2>
          <div className="row between wrap">
            <div>
              <h3 className="route-title">{top.name}</h3>
              <p className="muted">{top.from} → {top.to}</p>
            </div>
            <div className="right">
              <div className={`big-xl num-${top.level}`}>{top.risk}%</div>
              <StatusPill level={top.level}>{top.level.toUpperCase()} RISK</StatusPill>
            </div>
          </div>
          <p className="attn-text">{describe(top)}</p>
          <div className="row gap-lg wrap">
            <div><div className="cap">Accessibility</div><div className="big sm">{top.accessibility}%</div></div>
            <div><div className="cap">ETA</div><div className="big sm">{formatEta(top.eta)}</div></div>
          </div>
          <div className="row gap wrap">
            <Button as={Link} to={`/app/routes/${top.id}`}>View Route</Button>
            <Button as={Link} to={`/app/routes?compare=${top.id},${recommended.id}`} variant="secondary">Compare Alternatives</Button>
          </div>
        </Card>

        <Card className="reco-card">
          <p className="cap brand">ROUTIQ recommends</p>
          <h2>{recommended.name}</h2>
          <p className="muted">{recommended.from} → {recommended.to}</p>
          <ul className="plain">
            <li><strong>{recommended.risk}%</strong> Risk</li>
            <li><strong>{recommended.accessibility}%</strong> Accessibility</li>
            <li><strong>{formatEta(recommended.eta)}</strong> ETA</li>
          </ul>
          <div className="row gap wrap">
            <Button as={Link} to={`/app/routes/${recommended.id}`}>View Recommendation</Button>
            <Button variant="ghost" onClick={() => setWhy(true)}><HelpCircle size={15} /> Why?</Button>
          </div>
        </Card>
      </div>

      <div className="split">
        <Card className="live-card">
          <div className="row between wrap">
            <div><h2>Live situation</h2><p className="muted">Vehicles, routes and incidents at a glance.</p></div>
            <Button variant="secondary" onClick={() => navigate('/app/map')}>Open Live Map</Button>
          </div>
          <div className="preview-map-box"><MapPanel compact height="100%" /></div>
        </Card>
        <Card>
          <h2>Alerts</h2>
          <div className="stack">
            {alerts.slice(0, 3).map((a) => <AlertCard key={a.id} alert={a} compact />)}
          </div>
          <Button as={Link} to="/app/alerts" variant="secondary">View All Alerts <ArrowRight size={14} /></Button>
        </Card>
      </div>

      <Modal open={why} onClose={() => setWhy(false)} title={`Why ${recommended.name}?`}>
        <ul className="checks big">
          {explain(recommended, other).map((x) => <li key={x}><Check size={16} /> {x}</li>)}
        </ul>
        <p className="muted small">Rule-based risk analysis · compared with {other.name} · Demo / Simulated Data</p>
      </Modal>
    </div>
  );
}
