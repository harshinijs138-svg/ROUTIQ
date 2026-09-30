import { delay } from './delay';
import { clamp } from '../utils/risk';
// Derives service-access scores from the current route accessibility values (rule-based, simulated).
export function computeAccessibility(routes) {
  const overall = Math.round(routes.reduce((s, r) => s + r.accessibility, 0) / routes.length);
  const worst = Math.min(...routes.map((r) => r.accessibility));
  return {
    overall,
    items: [
      { key: 'road', label: 'Road Access', value: clamp(overall + 5), note: 'Share of road network passable for freight.' },
      { key: 'emergency', label: 'Emergency Access', value: clamp(Math.round((overall + worst) / 2) - 6), note: 'Ability of ambulances and relief vehicles to reach communities.' },
      { key: 'hospital', label: 'Hospital Access', value: clamp(overall - 1), note: 'Reachability of hospitals from major hubs.' },
      { key: 'supply', label: 'Supply Access', value: clamp(overall + 4), note: 'Reachability of markets and supply depots.' },
    ],
  };
}
export const getAccessibility = (routes) => delay(computeAccessibility(routes), 80);
