import { Link } from 'react-router-dom';
// Original mark: a route line that bends into the letter R and ends in a destination dot.
export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#c8401d" />
      <path d="M10 25V8h7.2a4.6 4.6 0 0 1 0 9.2H10m6 0 6 7.8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="25" r="2.2" fill="#fff" />
    </svg>
  );
}
export default function Logo({ to = '/', size = 30 }) {
  return (
    <Link to={to} className="logo" aria-label="ROUTIQ home">
      <LogoMark size={size} />
      <span className="logo-word">ROUTIQ</span>
    </Link>
  );
}
