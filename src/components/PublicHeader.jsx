import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import { Button, Drawer } from './ui';
import { useApp } from '../hooks/useApp';

const links = [['Platform', '/#platform'], ['How It Works', '/how-it-works'], ['Solutions', '/#solutions'], ['Impact', '/#impact']];

export default function PublicHeader() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const launch = () => { login(); navigate('/app/dashboard'); };
  return (
    <header className="pub-header">
      <div className="container row between">
        <Logo />
        <nav className="pub-nav" aria-label="Primary">
          {links.map(([l, to]) => <a key={l} href={to}>{l}</a>)}
        </nav>
        <div className="row gap pub-actions">
          <Link to="/login" className="link-quiet">Sign In</Link>
          <Button onClick={launch}>Launch Dashboard</Button>
        </div>
        <button className="icon-btn only-mobile" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22} /></button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="left">
        <nav className="stack">
          {links.map(([l, to]) => <a key={l} href={to} className="drawer-link" onClick={() => setOpen(false)}>{l}</a>)}
          <Link to="/login" className="drawer-link" onClick={() => setOpen(false)}>Sign In</Link>
          <Button onClick={launch}>Launch Dashboard</Button>
        </nav>
      </Drawer>
    </header>
  );
}
