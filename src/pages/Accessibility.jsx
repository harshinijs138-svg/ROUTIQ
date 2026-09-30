import { useMemo } from 'react';
import { Card, PageHeader, ProgressBar, DataLabel } from '../components/ui';
import { useApp } from '../hooks/useApp';
import { computeAccessibility } from '../services/accessibilityService';

export default function Accessibility() {
  const { routes } = useApp();
  const data = useMemo(() => computeAccessibility(routes), [routes]);
  const emergency = data.items.find((i) => i.key === 'emergency');
  return (
    <div className="page">
      <PageHeader title="Accessibility Intelligence" subtitle="Understand how disruption affects access to essential services." actions={<DataLabel />} />
      <div className="split">
        <Card className="center-card">
          <p className="cap">Overall Accessibility</p>
          <div className="big-hero">{data.overall}%</div>
          <p className="muted">{emergency.value < 50 ? 'Emergency access is reduced. Prioritise safer routes for medical and relief supplies.' : 'Access to essential services is holding steady.'}</p>
        </Card>
        <Card>
          <div className="stack-lg">
            {data.items.map((i) => (
              <div key={i.key}><ProgressBar label={i.label} value={i.value} /><p className="muted small">{i.note}</p></div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <h2>By route</h2>
        <div className="stack">{routes.map((r) => <ProgressBar key={r.id} label={`${r.name} · ${r.from} → ${r.to}`} value={r.accessibility} />)}</div>
      </Card>
    </div>
  );
}
