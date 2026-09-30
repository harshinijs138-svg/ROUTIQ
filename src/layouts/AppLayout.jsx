import { useEffect, useRef, useState } from 'react';
import { NavLink, Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, Menu, Play, Wifi, WifiOff, User, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import DemoOverlay from '../components/DemoOverlay';
import { Button, Drawer, DataLabel, LoadingState, ErrorState } from '../components/ui';
import { useApp } from '../hooks/useApp';

const main = [['Dashboard', '/app/dashboard'], ['Live Map', '/app/map'], ['Routes', '/app/routes'], ['Vehicles', '/app/vehicles'], ['Alerts', '/app/alerts']];
const more = [['Logistics', '/app/logistics'], ['Accessibility', '/app/accessibility'], ['Field Reports', '/app/reports'], ['Analytics', '/app/analytics'], ['What-If Simulation', '/app/simulation'], ['Impact Summary', '/app/impact'], ['Settings', '/app/settings']];

function Menu_({ label, children, icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', on); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', on); document.removeEventListener('keydown', esc); };
  }, []);
  return (
    <div className="menu" ref={ref}>
      <button className={icon ? 'icon-btn' : 'nav-link'} aria-haspopup="menu" aria-expanded={open} aria-label={icon ? label : undefined} onClick={() => setOpen(!open)}>
        {icon || <>{label} <ChevronDown size={14} /></>}
      </button>
      {open && <div className="menu-pop" role="menu" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  );
}

export default function AppLayout() {
  const { authed, boot, reload, alerts, online, setOnline, startDemo, demo, logout } = useApp();
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (!authed) return <Navigate to="/login" replace />;
  const urgent = alerts.filter((a) => ['critical', 'high'].includes(a.severity)).length;
  const begin = () => { setNav(false); startDemo(); };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container row between">
          <div className="row gap-lg">
            <Logo to="/app/dashboard" />
          
          </div>
          <nav className="app-nav" aria-label="Main">
            {main.map(([l, to]) => <NavLink key={to} to={to} className="nav-link">{l}</NavLink>)}
            <Menu_ label="More">
              {more.map(([l, to]) => <NavLink key={to} to={to} role="menuitem" className="menu-item">{l}</NavLink>)}
            </Menu_>
          </nav>
          <div className="row gap">
            <DataLabel />
            <button className={`online ${online ? '' : 'off'}`} onClick={() => setOnline(!online)} title="Toggle simulated connection">
              {online ? <><Wifi size={14} /> Online</> : <><WifiOff size={14} /> Offline</>}
            </button>
            {!demo.active && <Button size="sm" variant="secondary" className="hide-mobile" onClick={begin}><Play size={14} /> Start 2-Minute Demo</Button>}
            <Link to="/app/alerts" className="icon-btn bell" aria-label={`Notifications, ${urgent} urgent`}>
              <Bell size={19} />{urgent > 0 && <span className="dot">{urgent}</span>}
            </Link>
            <Menu_ label="Profile" icon={<User size={19} />}>
              <div className="menu-note">Demo user<br /><span className="muted small">demo@routiq.demo</span></div>
              <button className="menu-item" onClick={() => navigate('/app/settings')}>Settings</button>
              <button className="menu-item" onClick={() => { logout(); navigate('/'); }}><LogOut size={14} /> Sign out</button>
            </Menu_>
            <button className="icon-btn only-mobile" aria-label="Open menu" onClick={() => setNav(true)}><Menu size={22} /></button>
          </div>
        </div>
      </header>

      <Drawer open={nav} onClose={() => setNav(false)} title="Menu" side="left">
        <nav className="stack">
          {[...main, ...more].map(([l, to]) => <NavLink key={to} to={to} className="drawer-link" onClick={() => setNav(false)}>{l}</NavLink>)}
          <Button onClick={begin}><Play size={14} /> Start 2-Minute Demo</Button>
        </nav>
      </Drawer>

      <main className={`app-main ${pathname.endsWith('/map') ? 'app-main-full' : ''}`}>
        {boot.status === 'loading' && <LoadingState label="Loading network…" />}
        {boot.status === 'error' && <ErrorState message={boot.message || 'Could not load the network.'} onRetry={reload} />}
        {boot.status === 'ready' && <Outlet />}
      </main>
      <DemoOverlay />
    </div>
  );
}
