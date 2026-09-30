import { Card, MetricCard, PageHeader, StatusPill, DataLabel } from '../components/ui';
import { useApp } from '../hooks/useApp';
import { formatEta } from '../utils/risk';

export default function Logistics() {
  const { deliveries } = useApp();
  const c = (s) => deliveries.filter((d) => d.status === s).length;
  const tone = { 'In Transit': 'medium', Delayed: 'high', Delivered: 'low' };
  return (
    <div className="page">
      <PageHeader title="Logistics" subtitle="Every delivery, and whether it is on track." actions={<DataLabel />} />
      <div className="kpis five">
        <MetricCard label="Active deliveries" value={deliveries.filter((d) => d.status !== 'Delivered').length} />
        <MetricCard label="In transit" value={c('In Transit')} />
        <MetricCard label="Delivered" value={c('Delivered')} />
        <MetricCard label="Delayed" value={c('Delayed')} tone={c('Delayed') ? 'critical' : undefined} />
        <MetricCard label="At risk" value={deliveries.filter((d) => d.atRisk).length} tone={deliveries.some((d) => d.atRisk) ? 'critical' : undefined} />
      </div>
      <Card className="list-card">
        {deliveries.map((d) => (
          <div key={d.id} className="delivery">
            <div><strong>{d.id}</strong><span className="muted">{d.cargo}</span></div>
            <span>{d.origin} → {d.destination}</span>
            <span className="muted">{d.vehicle && d.status !== 'Delivered' ? `${d.vehicle.id} · ETA ${formatEta(d.vehicle.etaMin)}` : d.vehicle?.id}</span>
            <span className="row gap">{d.atRisk && <StatusPill level="high">At risk</StatusPill>}<StatusPill level={tone[d.status]}>{d.status}</StatusPill></span>
          </div>
        ))}
      </Card>
    </div>
  );
}
