import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, Waves, Mountain, Ban, Car, ArrowRight } from 'lucide-react';
import { Button, Card, PageHeader, StatusPill, DataLabel } from '../components/ui';
import ImpactSummary from '../components/ImpactSummary';
import { useApp } from '../hooks/useApp';
import { SCENARIOS, evaluateRoute, recommend, formatEta } from '../utils/risk';

const icons = { rainfall: CloudRain, flood: Waves, landslide: Mountain, closure: Ban, traffic: Car };

export default function Simulation() {
  const { routes, baselineRoutes, scenario, sim, setScenario } = useApp();
  const [sel, setSel] = useState('rainfall');
  if (!routes.length) return null;
  const before = baselineRoutes.find((r) => r.id === 'A');
  const preview = routes.map((r) => evaluateRoute(r, sel, 1));
  const after = preview.find((r) => r.id === 'A');
  const rec = recommend(preview);
  const applied = scenario === sel && sim.intensity === 1;

  return (
    <div className="page">
      <PageHeader title="What if conditions change?" subtitle="Simulate a disruption and see how it affects your network." actions={<DataLabel />} />
      <div className="scenarios" role="group" aria-label="Scenarios">
        {Object.entries(SCENARIOS).map(([k, s]) => {
          const Icon = icons[k];
          return (
            <button key={k} className={`scenario ${sel === k ? 'on' : ''}`} aria-pressed={sel === k} onClick={() => setSel(k)}>
              <Icon size={22} /><strong>{s.label}</strong><span>{s.blurb}</span>
            </button>
          );
        })}
      </div>

      <div className="ba">
        <Card>
          <p className="cap">Before · Normal conditions</p>
          <h3>Route A</h3>
          <div className="row gap-lg"><div><div className="big-xl">{before.risk}%</div><div className="cap">Risk</div></div><div><div className="big-xl">{before.accessibility}%</div><div className="cap">Accessibility</div></div></div>
        </Card>
        <div className="ba-arrow"><ArrowRight /></div>
        <Card>
          <p className="cap">After · {SCENARIOS[sel].label}</p>
          <h3>Route A</h3>
          <div className="row gap-lg"><div><div className={`big-xl num-${after.level}`}>{after.risk}%</div><div className="cap">Risk</div></div><div><div className="big-xl num-high">{after.accessibility}%</div><div className="cap">Accessibility</div></div></div>
          <StatusPill level={after.level} />
        </Card>
        <Card className="reco-card">
          <p className="cap brand">ROUTIQ response</p>
          <h3>Recommended: {rec.name}</h3>
          <div className="row gap-lg"><div><div className="big-xl">{rec.risk}%</div><div className="cap">Risk</div></div><div><div className="big-xl">{rec.accessibility}%</div><div className="cap">Accessibility</div></div></div>
          <p className="muted small">ETA {formatEta(rec.eta)} · Rule-based analysis</p>
          <Button as={Link} to={`/app/routes/${rec.id}`}>View Safer Route</Button>
        </Card>
      </div>

      <div className="row gap wrap">
        <Button size="lg" onClick={() => setScenario(sel, 1)} disabled={applied}>{applied ? 'Applied to network' : 'Apply to network'}</Button>
        <Button size="lg" variant="secondary" onClick={() => setScenario(null, 1)}>Reset to normal</Button>
        <span className="muted small">Applying updates the dashboard, map, routes, vehicles and alerts.</span>
      </div>

      {applied && <div className="mt-lg"><h2>Operational Impact</h2><ImpactSummary /></div>}
    </div>
  );
}
