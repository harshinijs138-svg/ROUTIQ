import { useState } from 'react';
import { CheckCircle2, CloudOff } from 'lucide-react';
import { Button, Card, PageHeader, StatusPill, DataLabel, Badge } from '../components/ui';
import { useApp } from '../hooks/useApp';

const types = ['Heavy Rainfall', 'Flood', 'Landslide', 'Road Blockage', 'Traffic Disruption'];
const severities = ['Low', 'Medium', 'High', 'Critical'];
const empty = { type: types[0], severity: 'Medium', location: '', routeId: 'A', description: '' };

export default function Reports() {
  const { submitReport, reports, routes, online, setOnline } = useApp();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.location.trim()) err.location = 'Enter the location of the incident.';
    if (!form.description.trim()) err.description = 'Add a short description.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const res = submitReport(form);
    setNotice(res.queued ? 'Report queued for synchronization.' : 'Report submitted.');
    setForm(empty);
  };

  return (
    <div className="page">
      <PageHeader title="Field Reports" subtitle="Report what you see on the road." actions={<DataLabel>Simulated sync</DataLabel>} />
      {!online && (
        <div className="banner"><CloudOff size={16} /> Offline. Reports will sync when connection returns.
          <Button size="sm" variant="secondary" onClick={() => setOnline(true)}>Simulate reconnect</Button></div>
      )}
      <div className="split">
        <Card>
          <form onSubmit={submit} className="stack" noValidate>
            <label className="field">Incident type
              <select value={form.type} onChange={set('type')}>{types.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label className="field">Severity
              <select value={form.severity} onChange={set('severity')}>{severities.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label className="field">Location
              <input value={form.location} onChange={set('location')} placeholder="e.g. Near Nongpoh" aria-invalid={Boolean(errors.location)} />
              {errors.location && <span className="form-error" role="alert">{errors.location}</span>}
            </label>
            <label className="field">Affected route
              <select value={form.routeId} onChange={set('routeId')}>
                {routes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                <option value="">Other / not on a listed route</option>
              </select>
            </label>
            <label className="field">Description
              <textarea rows={4} value={form.description} onChange={set('description')} aria-invalid={Boolean(errors.description)} />
              {errors.description && <span className="form-error" role="alert">{errors.description}</span>}
            </label>
            <Button type="submit" size="lg">Submit Report</Button>
            {notice && <p className="success" role="status"><CheckCircle2 size={16} /> {notice}</p>}
          </form>
        </Card>
        <Card>
          <h2>Recent reports</h2>
          {reports.length === 0 ? <p className="muted">No reports yet. Submitted reports appear here.</p> : (
            <div className="stack">
              {reports.map((r) => (
                <div key={r.id} className="report">
                  <div className="row between"><strong>{r.type}</strong><StatusPill level={r.status === 'Queued' ? 'medium' : 'low'}>{r.status === 'Synced' ? 'Sync complete' : r.status}</StatusPill></div>
                  <span className="muted">{r.location} · {r.severity}{r.routeId ? ` · Route ${r.routeId}` : ''}</span>
                  <span className="small">{r.description}</span>
                  <Badge>{r.id} · simulated</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
