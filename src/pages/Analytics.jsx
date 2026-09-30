import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, PageHeader, DataLabel } from '../components/ui';
import { useApp } from '../hooks/useApp';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
const axis = { fontSize: 12, fill: '#6b6b66' };

function Chart({ title, note, children }) {
  return (
    <Card>
      <h2>{title}</h2>
      {note && <p className="muted small">{note}</p>}
      <div className="chart">{children}</div>
    </Card>
  );
}

export default function Analytics() {
  const { routes, vehicles, deliveries } = useApp();
  const a = routes.find((r) => r.id === 'A');
  const d = routes.find((r) => r.id === 'D');
  const overall = Math.round(routes.reduce((s, r) => s + r.accessibility, 0) / (routes.length || 1));
  const risk = [30, 33, 31, 36, 34, 32].concat(a?.risk ?? 0).map((v, i) => ({ day: days[i], 'Route A': v, 'Route D': i === 6 ? d?.risk : [9, 8, 9, 10, 8, 8][i] }));
  const acc = [68, 66, 67, 65, 66, 68].concat(overall).map((v, i) => ({ day: days[i], Accessibility: v }));
  const count = (list, key, val) => list.filter((x) => x[key] === val).length;
  const vs = ['Moving', 'Delayed', 'Delivered'].map((n) => ({ name: n, value: count(vehicles, 'status', n) })).filter((x) => x.value > 0);
  const ds = ['In Transit', 'Delayed', 'Delivered'].map((n) => ({ name: n, Deliveries: count(deliveries, 'status', n) }));
  const colors = { Moving: '#1f5f8b', Delayed: '#d9480f', Delivered: '#1f8a4c' };

  return (
    <div className="page">
      <PageHeader title="Analytics" subtitle="Trends at a glance. Earlier days are simulated history." actions={<DataLabel />} />
      <div className="charts">
        <Chart title="Route risk trend" note="Percent risk, last 7 days">
          <ResponsiveContainer width="100%" height="100%"><LineChart data={risk}><CartesianGrid stroke="#eee8df" vertical={false} /><XAxis dataKey="day" tick={axis} /><YAxis domain={[0, 100]} tick={axis} /><Tooltip /><Legend />
            <Line type="monotone" dataKey="Route A" stroke="#c8401d" strokeWidth={2.5} dot={false} /><Line type="monotone" dataKey="Route D" stroke="#1f5f8b" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer>
        </Chart>
        <Chart title="Vehicle status" note="Vehicles by current status">
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={vs} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>{vs.map((e) => <Cell key={e.name} fill={colors[e.name]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
        </Chart>
        <Chart title="Delivery status" note="Deliveries by current status">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={ds}><CartesianGrid stroke="#eee8df" vertical={false} /><XAxis dataKey="name" tick={axis} /><YAxis allowDecimals={false} tick={axis} /><Tooltip /><Bar dataKey="Deliveries" fill="#1f5f8b" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </Chart>
        <Chart title="Accessibility trend" note="Overall accessibility, last 7 days">
          <ResponsiveContainer width="100%" height="100%"><LineChart data={acc}><CartesianGrid stroke="#eee8df" vertical={false} /><XAxis dataKey="day" tick={axis} /><YAxis domain={[0, 100]} tick={axis} /><Tooltip />
            <Line type="monotone" dataKey="Accessibility" stroke="#1f8a4c" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer>
        </Chart>
      </div>
    </div>
  );
}
