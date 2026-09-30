import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button, Card, DataLabel } from '../components/ui';
import { useApp } from '../hooks/useApp';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@routiq.demo');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const enter = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Enter an email and password, or continue with the demo.'); return; }
    login(); navigate('/app/dashboard');
  };
  const demo = () => { login(); navigate('/app/dashboard'); };
  return (
    <div className="login grid-bg">
      <Card className="login-card">
        <Logo />
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to your command center. No backend is used in this demo.</p>
        <form onSubmit={enter} className="stack" noValidate>
          <label className="field">Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="field">Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" size="lg">Enter Command Center</Button>
          <Button type="button" variant="secondary" size="lg" onClick={demo}>Continue Demo</Button>
        </form>
        <p className="muted small">Demo credentials are prefilled. <DataLabel /> · <Link to="/">Back to home</Link></p>
      </Card>
    </div>
  );
}
