// ROUTIQ rule-based weighted risk engine (transparent scoring, no trained ML).
export const WEIGHTS = { rainfall: 0.18, flood: 0.12, landslide: 0.2, traffic: 0.1, road: 0.1, access: 0.3 };

export const FACTOR_LABELS = {
  rainfall: 'Rainfall', flood: 'Flood', landslide: 'Landslide', traffic: 'Traffic', road: 'Road condition', access: 'Accessibility impact',
};

// Each scenario raises hazard factors; the effect on a route is scaled by that route's exposure to the scenario.
export const SCENARIOS = {
  rainfall: { label: 'Heavy Rainfall', blurb: 'Intense rain across the Khasi Hills corridor.', delta: { rainfall: 50, flood: 15, landslide: 40, road: 25, traffic: 15 } },
  flood: { label: 'Flood', blurb: 'Rivers overflow near low-lying road sections.', delta: { rainfall: 20, flood: 55, road: 30, traffic: 20 } },
  landslide: { label: 'Landslide', blurb: 'Slope failure on hill sections.', delta: { rainfall: 10, landslide: 60, road: 40, traffic: 15 } },
  closure: { label: 'Road Closure', blurb: 'A road section is closed to traffic.', delta: { road: 70, traffic: 40 } },
  traffic: { label: 'Traffic', blurb: 'Severe congestion at key junctions.', delta: { traffic: 55, road: 10 } },
};

export const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));

export function levelOf(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

export const accessibilityOf = (f) =>
  Math.round(clamp(100 - (0.3 * f.landslide + 0.22 * f.flood + 0.2 * f.road + 0.15 * f.traffic + 0.13 * f.rainfall)));

export function scoreOf(f, accessibility) {
  const g = { ...f, access: 100 - accessibility };
  return Math.round(clamp(Object.keys(WEIGHTS).reduce((s, k) => s + WEIGHTS[k] * g[k], 0)));
}

export function evaluateRoute(route, scenario = null, intensity = 1) {
  const factors = { ...route.base };
  if (scenario && SCENARIOS[scenario]) {
    const ex = route.exposure[scenario] ?? 0;
    Object.entries(SCENARIOS[scenario].delta).forEach(([k, d]) => { factors[k] = clamp(factors[k] + d * ex * intensity); });
  }
  const accessibility = accessibilityOf(factors);
  const risk = scoreOf(factors, accessibility);
  const eta = Math.round(route.baseEta * (1 + risk / 150));
  return { ...route, factors, risk, accessibility, level: levelOf(risk), eta };
}

export const formatEta = (min) => `${Math.floor(min / 60)}h ${String(Math.round(min % 60)).padStart(2, '0')}m`;

export function recommend(routes) {
  return [...routes].sort((a, b) => a.risk - b.risk || b.accessibility - a.accessibility)[0];
}

// Plain-language reasons why `best` beats `other`, derived from real factor differences.
export function explain(best, other) {
  const out = [];
  if (best.factors.rainfall < other.factors.rainfall) out.push('Lower rainfall exposure');
  if (best.factors.landslide < other.factors.landslide) out.push('Lower landslide exposure');
  if (best.factors.flood < other.factors.flood) out.push('Lower flood exposure');
  if (best.factors.traffic < other.factors.traffic) out.push('Lighter traffic');
  if (best.accessibility > other.accessibility) out.push('Better accessibility');
  if (best.risk < other.risk) out.push('Lower overall disruption score');
  return out;
}
