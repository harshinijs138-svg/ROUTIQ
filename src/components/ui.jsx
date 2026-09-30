import { useEffect, useRef } from 'react';
import { X, AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import { levelLabel } from '../utils/format';

export function Button({ variant = 'primary', size = 'md', as: As = 'button', className = '', ...props }) {
  const extra = As === 'button' ? { type: props.type || 'button' } : {};
  return <As className={`btn btn-${variant} btn-${size} ${className}`} {...extra} {...props} />;
}
export function Card({ className = '', children, as: As = 'div', ...props }) {
  return <As className={`card ${className}`} {...props}>{children}</As>;
}
export function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function StatusPill({ level, children }) {
  return <span className={`pill lv-${level}`}><i aria-hidden="true" />{children || levelLabel[level] || level}</span>;
}
export function MetricCard({ label, value, hint, tone }) {
  return (
    <Card className={`metric ${tone ? `metric-${tone}` : ''}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {hint && <div className="metric-hint">{hint}</div>}
    </Card>
  );
}
// kind="access": low is bad. kind="risk": high is bad.
export function ProgressBar({ value, kind = 'access', label, showValue = true }) {
  const bad = kind === 'access' ? 100 - value : value;
  const tone = bad >= 75 ? 'critical' : bad >= 50 ? 'high' : bad >= 25 ? 'medium' : 'low';
  return (
    <div className="progress-wrap">
      {(label || showValue) && (
        <div className="progress-head"><span>{label}</span>{showValue && <strong>{value}%</strong>}</div>
      )}
      <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'progress'}>
        <span className={`fill fill-${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
export function DataLabel({ children = 'Demo / Simulated Data' }) {
  return <span className="data-label">{children}</span>;
}

function useDialog(open, onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [open]);
  return ref;
}
export function Modal({ open, onClose, title, children }) {
  const ref = useDialog(open, onClose);
  if (!open) return null;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        {children}
      </div>
    </div>
  );
}
// Right-side drawer on desktop, bottom sheet on mobile (CSS), left drawer for nav via side="left".
export function Drawer({ open, onClose, title, side = 'right', children }) {
  const ref = useDialog(open, onClose);
  if (!open) return null;
  return (
    <div className="overlay overlay-drawer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className={`drawer drawer-${side}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  );
}
export function LoadingState({ label = 'Loading…' }) {
  return <div className="state" role="status"><Loader2 className="spin" size={22} /><p>{label}</p></div>;
}
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state" role="alert">
      <AlertTriangle size={22} /><p>{message}</p>
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
export function EmptyState({ title = 'Nothing here yet', text, action }) {
  return <div className="state"><Inbox size={22} /><h3>{title}</h3>{text && <p>{text}</p>}{action}</div>;
}
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-head">
      <div><h1>{title}</h1>{subtitle && <p className="sub">{subtitle}</p>}</div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
