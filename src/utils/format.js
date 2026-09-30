export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');
export const ago = (m) => (m <= 0 ? 'Just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`);
export const levelLabel = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' };
