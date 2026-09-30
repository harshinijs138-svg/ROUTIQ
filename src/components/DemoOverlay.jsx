import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pause, Play, SkipForward, X } from 'lucide-react';
import { Button } from './ui';
import { useApp } from '../hooks/useApp';

const STEPS = [
  { title: 'Normal network', text: 'All four routes are within safe limits. Vehicles are moving on schedule.', path: '/app/dashboard', run: ({ setScenario }) => setScenario(null, 1) },
  { title: 'Heavy rainfall detected', text: 'Rain is building over the Shillong corridor. New incidents appear on the map.', path: '/app/map', run: ({ setScenario }) => setScenario('rainfall', 0.4) },
  { title: 'Route A risk increases', text: 'Rainfall and landslide exposure push Route A into the critical band.', path: '/app/routes', run: ({ setScenario }) => setScenario('rainfall', 1) },
  { title: 'Accessibility decreases', text: 'Emergency and hospital access along the corridor drop sharply.', path: '/app/accessibility', run: () => {} },
  { title: 'ROUTIQ recommends Route D', text: 'Route D has the lowest risk and the best accessibility. The reasons are shown.', path: '/app/dashboard', run: () => {} },
  { title: 'Alert generated', text: 'The team is notified with a clear recommendation.', path: '/app/alerts', run: ({ addAlert }) => addAlert({ id: 'AL-DEMO', severity: 'high', title: 'ROUTIQ recommends rerouting via Route D', place: 'Guwahati → Shillong', minutesAgo: 0, focus: null }) },
  { title: 'Vehicle rerouted', text: 'VH-003 is moved to Route D. Its ETA and risk update.', path: '/app/vehicles', run: ({ reroute }) => reroute('VH-003', 'D') },
  { title: 'Impact summary', text: 'From disruption to decision, in one summary.', path: '/app/impact', run: () => {} },
];

export default function DemoOverlay() {
  const app = useApp();
  const { demo, setDemo, exitDemo, routes } = app;
  const navigate = useNavigate();
  const step = demo.step;

  useEffect(() => {
    if (!demo.active) return;
    const s = STEPS[step];
    navigate(s.path);
    s.run(app);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo.active, step]);

  useEffect(() => {
    if (!demo.active || demo.paused || step >= STEPS.length - 1) return undefined;
    const t = setTimeout(() => setDemo((d) => ({ ...d, step: d.step + 1 })), 6500);
    return () => clearTimeout(t);
  }, [demo, step, setDemo]);

  if (!demo.active) return null;
  const a = routes.find((r) => r.id === 'A');
  const last = step === STEPS.length - 1;
  const next = () => (last ? setDemo({ active: false, step: 0, paused: false }) : setDemo((d) => ({ ...d, step: d.step + 1 })));
  return (
    <aside className="demo-bar" aria-live="polite" aria-label="Guided demo">
      <div className="demo-progress"><span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      <div className="row between">
        <span className="cap">Demo · {step + 1} / {STEPS.length}</span>
        <button className="icon-btn" aria-label="Exit demo" onClick={exitDemo}><X size={16} /></button>
      </div>
      <h3>{STEPS[step].title}</h3>
      <p>{STEPS[step].text}</p>
      {a && <p className="demo-nums">Route A: <strong>{a.risk}% risk</strong> · <strong>{a.accessibility}% accessibility</strong></p>}
      <div className="row gap wrap">
        <Button size="sm" onClick={next}>{last ? 'Finish' : <>Next <SkipForward size={14} /></>}</Button>
        <Button size="sm" variant="secondary" onClick={() => setDemo((d) => ({ ...d, paused: !d.paused }))}>
          {demo.paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
        </Button>
        <Button size="sm" variant="ghost" onClick={exitDemo}>Exit Demo</Button>
      </div>
    </aside>
  );
}
