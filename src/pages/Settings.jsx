import { useNavigate } from 'react-router-dom';
import { Button, Card, PageHeader, DataLabel } from '../components/ui';
import { useApp } from '../hooks/useApp';

export default function Settings() {
  const { online, setOnline, resetNetwork, logout, startDemo } = useApp();
  const navigate = useNavigate();
  return (
    <div className="page">
      <PageHeader title="Settings" subtitle="Demo controls and preferences." actions={<DataLabel />} />
      <Card className="list-card">
        <div className="setting">
          <div><strong>Simulated connection</strong><p className="muted small">Go offline to see reports queue for synchronization. This is a simulation.</p></div>
          <Button variant="secondary" onClick={() => setOnline(!online)}>{online ? 'Go offline' : 'Go online'}</Button>
        </div>
        <div className="setting">
          <div><strong>Reset demo data</strong><p className="muted small">Return the network to its starting state (heavy rainfall active, no reroutes).</p></div>
          <Button variant="secondary" onClick={resetNetwork}>Reset</Button>
        </div>
        <div className="setting">
          <div><strong>Guided demo</strong><p className="muted small">Replay the two-minute walkthrough.</p></div>
          <Button onClick={startDemo}>Start 2-Minute Demo</Button>
        </div>
        <div className="setting">
          <div><strong>Account</strong><p className="muted small">Signed in as demo@routiq.demo (no real authentication).</p></div>
          <Button variant="secondary" onClick={() => { logout(); navigate('/'); }}>Sign out</Button>
        </div>
      </Card>
      <p className="muted small">All data is simulated. Risk scores use transparent rule-based weighting, not trained machine learning.</p>
    </div>
  );
}
