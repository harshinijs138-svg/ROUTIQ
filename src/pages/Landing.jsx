import { useNavigate } from 'react-router-dom';
import { Radar, LineChart, GitCompare, BellRing } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import NerIllustration from '../components/NerIllustration';
import Logo from '../components/Logo';
import { Button, Card, DataLabel, StatusPill } from '../components/ui';
import { useApp } from '../hooks/useApp';

const steps = [
  ['01', 'Sense', 'Monitor routes, vehicles and incidents.', Radar],
  ['02', 'Analyze', 'Understand risk and accessibility.', LineChart],
  ['03', 'Reroute', 'Compare safer alternatives.', GitCompare],
  ['04', 'Respond', 'Alert teams and track action.', BellRing],
];

export default function Landing() {
  const { login } = useApp();
  const navigate = useNavigate();
  const launch = () => { login(); navigate('/app/dashboard'); };
  return (
    <div className="public">
      <PublicHeader />
      <main>
        <section className="hero grid-bg" id="platform">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Smart logistics for the North East</p>
              <h1 className="display">Intelligent routes.<br />Better access.</h1>
              <p className="lead">ROUTIQ helps logistics teams understand route risks, compare alternatives, track vehicles and respond to disruptions across the North Eastern Region.</p>
              <div className="row gap wrap">
                <Button size="lg" onClick={launch}>Launch ROUTIQ</Button>
                <Button size="lg" variant="secondary" as="a" href="#how">See How It Works</Button>
              </div>
              <p className="muted small mt"><DataLabel /> · Smart logistics intelligence for a connected North East.</p>
            </div>
            <Card className="hero-card">
              <NerIllustration />
              <div className="hero-stats">
                <div><strong>4</strong><span>Routes compared</span></div>
                <div><strong>6</strong><span>Vehicles tracked</span></div>
                <div><strong>8</strong><span>States covered</span></div>
              </div>
              <div className="hero-foot">Illustrative map · not to scale</div>
            </Card>
          </div>
        </section>

        <section className="section" id="how">
          <div className="container">
            <h2 className="h-xl">Four steps from signal to action.</h2>
            <div className="steps">
              {steps.map(([n, t, d, Icon]) => (
                <div key={n} className="step">
                  <div className="step-num">{n}</div>
                  <h3><Icon size={18} /> {t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section tint" id="preview">
          <div className="container">
            <h2 className="h-xl">One view of your logistics network.</h2>
            <p className="lead narrow">A map, the risk on each route, the status of every vehicle and the alerts that matter, in one place.</p>
            <Card className="preview">
              <div className="preview-map"><NerIllustration chips={false} /></div>
              <div className="preview-side">
                <div className="mini"><span className="cap">Route risk</span><div className="row between"><strong>Route A · Guwahati → Shillong</strong><StatusPill level="critical">75%</StatusPill></div></div>
                <div className="mini"><span className="cap">Vehicle status</span><div className="row between"><strong>VH-003 Fuel Tanker</strong><StatusPill level="high">Delayed</StatusPill></div></div>
                <div className="mini"><span className="cap">Alert</span><strong>Road blockage on Route A</strong><span className="muted small">ROUTIQ recommends Route D · 18% risk</span></div>
              </div>
            </Card>
            <p className="muted small">Illustrative preview using demo / simulated data.</p>
          </div>
        </section>

        <section className="section" id="solutions">
          <div className="container">
            <h2 className="h-xl">Built for the people who move goods.</h2>
            <div className="triple">
              <div><h3>Logistics operators</h3><p>See which routes are risky before a truck is dispatched, and switch to a safer one.</p></div>
              <div><h3>Health and relief supply</h3><p>Keep hospitals, clinics and relief camps reachable when monsoon disruption hits.</p></div>
              <div><h3>Regional planners</h3><p>Compare corridors and understand how disruption changes access across the region.</p></div>
            </div>
          </div>
        </section>

        <section className="section cta-band" id="impact">
          <div className="container center">
            <h2 className="h-xl">From disruption to decision.</h2>
            <p className="lead">What is happening? What is at risk? What should I do? ROUTIQ answers all three on one screen.</p>
            <Button size="lg" onClick={launch}>Launch ROUTIQ</Button>
          </div>
        </section>
      </main>
      <footer className="pub-footer">
        <div className="container row between wrap">
          <Logo size={24} />
          <span className="muted small">Intelligent Routes. Better Access. · <DataLabel /> · Rule-based risk analysis, not trained ML.</span>
        </div>
      </footer>
    </div>
  );
}
