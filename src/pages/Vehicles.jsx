import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button, Drawer, EmptyState, PageHeader, StatusPill, DataLabel } from '../components/ui';
import { VehicleCard } from '../components/cards';
import { useApp } from '../hooks/useApp';
import { formatEta } from '../utils/risk';
import { Link } from 'react-router-dom';

const filters = ['All', 'Moving', 'Delayed', 'Delivered'];

export default function Vehicles() {
  const { vehicles, recommended, reroute } = useApp();
  const [q, setQ] = useState('');
  const [f, setF] = useState('All');
  const [openId, setOpenId] = useState(null);
  const list = useMemo(() => vehicles.filter((v) => (f === 'All' || v.status === f) &&
    `${v.id} ${v.type} ${v.origin} ${v.destination}`.toLowerCase().includes(q.trim().toLowerCase())), [vehicles, q, f]);
  const v = vehicles.find((x) => x.id === openId);
  const canReroute = v && v.route && recommended && v.routeId !== recommended.id && v.status !== 'Delivered';

  return (
    <div className="page">
      <PageHeader title="Vehicle Tracking" subtitle="Follow every vehicle in your network." actions={<DataLabel>Simulated GPS</DataLabel>} />
      <div className="toolbar">
        <div className="search"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vehicle..." aria-label="Search vehicle" /></div>
        <div className="pills" role="group" aria-label="Status filter">
          {filters.map((x) => <button key={x} className={`fpill ${f === x ? 'on' : ''}`} aria-pressed={f === x} onClick={() => setF(x)}>{x}</button>)}
        </div>
      </div>
      {list.length === 0 ? <EmptyState title="No vehicles match" text="Try a different search or filter." action={<Button variant="secondary" onClick={() => { setQ(''); setF('All'); }}>Clear filters</Button>} /> : (
        <div className="stack">{list.map((x) => <VehicleCard key={x.id} vehicle={x} active={openId === x.id} onClick={() => setOpenId(x.id)} />)}</div>
      )}

      <Drawer open={Boolean(v)} onClose={() => setOpenId(null)} title={v ? `${v.id} · ${v.type}` : ''}>
        {v && (<>
          <div className="row between"><StatusPill level={v.status === 'Delayed' ? 'high' : v.status === 'Delivered' ? 'low' : 'medium'}>{v.status}</StatusPill><DataLabel>Simulated GPS</DataLabel></div>
          <dl className="facts stackfacts">
            <div><dt>Vehicle ID</dt><dd>{v.id}</dd></div>
            <div><dt>Type</dt><dd>{v.type}</dd></div>
            <div><dt>Origin</dt><dd>{v.origin}</dd></div>
            <div><dt>Destination</dt><dd>{v.destination}</dd></div>
            <div><dt>Current location</dt><dd>{v.pos[0].toFixed(3)}, {v.pos[1].toFixed(3)}</dd></div>
            <div><dt>Speed</dt><dd>{v.speed} km/h</dd></div>
            <div><dt>ETA</dt><dd>{v.status === 'Delivered' ? 'Delivered' : formatEta(v.etaMin)}</dd></div>
            <div><dt>Risk</dt><dd className="cap-first">{v.risk}</dd></div>
            <div><dt>Delivery status</dt><dd>{v.status === 'Delivered' ? 'Delivered' : v.status === 'Delayed' ? 'Delayed' : 'In transit'}</dd></div>
            <div><dt>Last update</dt><dd>{v.lastUpdate}</dd></div>
          </dl>
          <h3>Activity</h3>
          <ol className="timeline">
            {v.timeline.map((t) => <li key={t.label}><span className="t-time">{t.time}</span><div><strong>{t.label}</strong><span className="muted">{t.detail}</span></div></li>)}
          </ol>
          <div className="row gap wrap">
            {canReroute && <Button onClick={() => reroute(v.id, recommended.id)}>Reroute via {recommended.name}</Button>}
            <Button as={Link} to={`/app/map?focus=${v.id}`} variant="secondary">View on Map</Button>
          </div>
        </>)}
      </Drawer>
    </div>
  );
}
