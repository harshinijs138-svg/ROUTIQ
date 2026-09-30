// Original, illustrative (not to scale) map of the North East used on the landing page.
export default function NerIllustration({ chips = true }) {
  return (
    <div className="ner-ill">
      <svg viewBox="0 0 420 320" role="img" aria-label="Illustrative map of the North Eastern Region with routes, vehicles and a warning location">
        <path d="M30 150 L48 118 L62 126 L78 104 L104 112 L128 98 L160 102 L196 88 L232 70 L272 62 L318 48 L352 66 L380 96 L360 122 L340 140 L352 168 L330 200 L306 236 L282 262 L262 236 L246 214 L228 244 L206 232 L196 200 L172 190 L150 196 L124 182 L96 176 L70 182 L44 176 Z"
          fill="#f4ede4" stroke="#e0d5c7" strokeWidth="1.5" />
        <g fill="none" strokeLinecap="round" strokeWidth="3">
          <path d="M130 150 Q138 170 150 188" stroke="#c8401d" />
          <path d="M130 150 Q220 110 300 74" stroke="#1f5f8b" opacity=".75" strokeDasharray="1 7" />
          <path d="M130 150 Q200 150 280 215" stroke="#1f5f8b" opacity=".75" strokeDasharray="1 7" />
          <path d="M150 188 Q190 240 232 262" stroke="#1f5f8b" opacity=".75" strokeDasharray="1 7" />
        </g>
        {[[130, 150, 'Guwahati'], [150, 188, 'Shillong'], [300, 74, 'Itanagar'], [280, 215, 'Imphal'], [232, 262, 'Agartala']].map(([x, y, n]) => (
          <g key={n}><circle cx={x} cy={y} r="5" fill="#fff" stroke="#1a1a1a" strokeWidth="2" /><text x={x + 9} y={y + 4} fontSize="11" fill="#55554f" fontWeight="600">{n}</text></g>
        ))}
        {[[217, 111], [202, 166], [190, 232]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill="#1f8a4c" stroke="#fff" strokeWidth="2" />)}
        <circle cx="139" cy="169" r="14" fill="#c62828" opacity=".14" />
        <path d="M139 160 L148 176 H130 Z" fill="#c62828" />
        <rect x="137.6" y="165" width="2.8" height="6" rx="1" fill="#fff" /><circle cx="139" cy="173.5" r="1.4" fill="#fff" />
        <circle cx="150" cy="188" r="16" fill="none" stroke="#1f8a4c" strokeWidth="2" strokeDasharray="3 4" />
      </svg>
      {chips && (
        <>
          <span className="chip chip-a"><i style={{ background: '#c62828' }} />Route A · 75% risk</span>
          <span className="chip chip-b"><i style={{ background: '#1f8a4c' }} />Route D · 18% risk</span>
          <span className="chip chip-c"><i style={{ background: '#1f5f8b' }} />VH-001 · in transit</span>
        </>
      )}
    </div>
  );
}
