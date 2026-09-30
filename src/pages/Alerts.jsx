import { Card, EmptyState, PageHeader, DataLabel } from '../components/ui';
import { AlertCard } from '../components/cards';
import { useApp } from '../hooks/useApp';

export default function Alerts() {
  const { alerts } = useApp();
  return (
    <div className="page">
      <PageHeader title="Alerts" subtitle="Important changes that may require action." actions={<DataLabel />} />
      {alerts.length === 0 ? <EmptyState title="All clear" text="There are no alerts right now." /> : (
        <Card className="list-card">{alerts.map((a) => <AlertCard key={a.id} alert={a} />)}</Card>
      )}
    </div>
  );
}
