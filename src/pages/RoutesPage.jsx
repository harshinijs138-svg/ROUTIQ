import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GitCompare } from 'lucide-react';
import { Button, PageHeader, DataLabel } from '../components/ui';
import { RouteCard } from '../components/cards';
import RouteComparison from '../components/RouteComparison';
import { useApp } from '../hooks/useApp';

export default function RoutesPage() {
  const { routes, recommended } = useApp();
  const [params] = useSearchParams();
  const initial = (params.get('compare') || '').split(',').filter(Boolean).slice(0, 2);
  const [compare, setCompare] = useState(initial.length === 2);
  const [sel, setSel] = useState(initial);

  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id].slice(-2)));
  const a = routes.find((r) => r.id === sel[0]);
  const b = routes.find((r) => r.id === sel[1]);

  return (
    <div className="page">
      <PageHeader title="Route Intelligence" subtitle="Compare routes before making a logistics decision."
        actions={<>
          <DataLabel />
          <Button variant={compare ? 'primary' : 'secondary'} onClick={() => { setCompare(!compare); setSel([]); }}>
            <GitCompare size={16} /> {compare ? 'Exit compare' : 'Compare routes'}
          </Button>
        </>} />
      {compare && <p className="hint">{sel.length < 2 ? `Select ${2 - sel.length} more route${sel.length === 1 ? '' : 's'} to compare.` : 'Comparing two routes.'}</p>}
      {compare && a && b && <RouteComparison a={a} b={b} />}
      <div className="route-grid">
        {routes.map((r) => (
          <RouteCard key={r.id} route={r} recommended={recommended?.id === r.id} compareMode={compare} selected={sel.includes(r.id)} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}
