import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Card, EmptyState } from './ui';
import { useApp } from '../hooks/useApp';
import { SCENARIOS } from '../utils/risk';

export default function ImpactSummary() {
  const { impact, scenario } = useApp();
  if (!impact || !impact.active) {
    return <EmptyState title="No active disruption" text="Run a what-if simulation to see how a disruption changes your network." action={<Button as={Link} to="/app/simulation">Open simulation</Button>} />;
  }
  const { before, after, affected, delayed, recommended } = impact;
  return (
    <div className="stack-lg">
      <Card>
        <p className="muted">Scenario: <strong>{SCENARIOS[scenario]?.label}</strong> · Route A, Guwahati → Shillong</p>
        <div className="impact-grid">
          <div><div className="cap">Route risk</div><div className="big-xl">{before.risk}% <ArrowRight size={22} /> <span className={`num-${after.level}`}>{after.risk}%</span></div></div>
          <div><div className="cap">Accessibility</div><div className="big-xl">{before.accessibility}% <ArrowRight size={22} /> <span className="num-high">{after.accessibility}%</span></div></div>
          <div><div className="cap">Affected locations</div><div className="big-xl">{affected}</div></div>
          <div><div className="cap">Delayed vehicles</div><div className="big-xl">{delayed}</div></div>
          <div><div className="cap">Recommended route</div><div className="big-xl">{recommended?.name.replace('Route ', 'Route ')}</div></div>
        </div>
      </Card>
      <div className="closing">
        <h2>From disruption to decision.</h2>
        <p>ROUTIQ turns logistics intelligence into a clear operational response.</p>
        <div className="row gap wrap">
          <Button as={Link} to={`/app/routes/${recommended?.id || 'D'}`}>View Safer Route</Button>
          <Button as={Link} to="/app/map" variant="secondary">Open Live Map</Button>
        </div>
      </div>
    </div>
  );
}
