import PublicHeader from '../components/PublicHeader';
import { Button, Card, DataLabel } from '../components/ui';
import { WEIGHTS, FACTOR_LABELS } from '../utils/risk';
import { Link } from 'react-router-dom';

const steps = [
  ['01', 'Sense', 'ROUTIQ brings routes, vehicle positions and incidents into one picture so you can see what is happening across the region.'],
  ['02', 'Analyze', 'Each route gets a transparent risk score and an accessibility score built from rainfall, flood, landslide, traffic and road condition.'],
  ['03', 'Reroute', 'Compare routes side by side. ROUTIQ recommends the option with the lowest risk and explains why in plain language.'],
  ['04', 'Respond', 'Alerts flag what needs action. Reroute a vehicle, log a field report and review the operational impact.'],
];

export default function HowItWorks() {
  return (
    <div className="public">
      <PublicHeader />
      <main className="section grid-bg">
        <div className="container">
          <h1 className="display sm">How ROUTIQ works.</h1>
          <p className="lead narrow">Four steps, one connected view. Every score is explainable.</p>
          <div className="steps steps-2">
            {steps.map(([n, t, d]) => <div key={n} className="step"><div className="step-num">{n}</div><h3>{t}</h3><p>{d}</p></div>)}
          </div>
          <Card className="mt-lg">
            <h2>How risk is scored</h2>
            <p className="muted">A weighted sum of six factors, each scored 0 to 100. This is rule-based analysis with visible weights. It is not a trained machine learning model.</p>
            <div className="weights">
              {Object.entries(WEIGHTS).map(([k, w]) => (
                <div key={k} className="row between"><span>{FACTOR_LABELS[k]}</span><strong>{Math.round(w * 100)}%</strong></div>
              ))}
            </div>
            <p className="muted small">Bands: 0–24 Low · 25–49 Medium · 50–74 High · 75–100 Critical. <DataLabel /></p>
          </Card>
          <div className="mt-lg"><Button as={Link} to="/login">Enter ROUTIQ</Button></div>
        </div>
      </main>
    </div>
  );
}
