import { PageHeader, DataLabel } from '../components/ui';
import ImpactSummary from '../components/ImpactSummary';

export default function Impact() {
  return (
    <div className="page">
      <PageHeader title="Operational Impact" subtitle="What the current disruption means for your network." actions={<DataLabel />} />
      <ImpactSummary />
    </div>
  );
}
