import { Card, ProgressBar, StatusPill, Badge } from './ui';
import { explain, formatEta, recommend } from '../utils/risk';

const factors = [['rainfall', 'Rainfall'], ['flood', 'Flood'], ['landslide', 'Landslide'], ['traffic', 'Traffic'], ['road', 'Road condition']];

export default function RouteComparison({ a, b }) {
  const winner = recommend([a, b]);
  const other = winner.id === a.id ? b : a;
  const reasons = explain(winner, other);
  const cols = [a, b];
  return (
    <Card className="compare">
      <h2>{a.name} vs {b.name}</h2>
      <div className="compare-grid">
        {cols.map((r) => (
          <div key={r.id} className="compare-col">
            <div className="row between"><h3>{r.name}</h3><StatusPill level={r.level} /></div>
            <dl className="facts">
              <div><dt>Risk</dt><dd className={`num-${r.level}`}>{r.risk}%</dd></div>
              <div><dt>Accessibility</dt><dd>{r.accessibility}%</dd></div>
              <div><dt>ETA</dt><dd>{formatEta(r.eta)}</dd></div>
              <div><dt>Distance</dt><dd>{r.distance} km</dd></div>
            </dl>
            <h4>Disruption factors</h4>
            {factors.map(([k, l]) => <ProgressBar key={k} label={l} value={Math.round(r.factors[k])} kind="risk" />)}
          </div>
        ))}
      </div>
      <div className="reco">
        <div className="row gap"><strong>ROUTIQ recommendation</strong><Badge tone="brand">{winner.name}</Badge></div>
        <p>{winner.name} is the safer choice: {winner.risk}% risk against {other.risk}%, and {winner.accessibility}% accessibility against {other.accessibility}%.</p>
        {reasons.length > 0 && <ul className="checks">{reasons.map((x) => <li key={x}>{x}</li>)}</ul>}
        <span className="muted small">Rule-based risk analysis. Not a trained AI prediction.</span>
      </div>
    </Card>
  );
}
