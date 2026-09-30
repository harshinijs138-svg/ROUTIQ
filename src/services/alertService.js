import { baseAlerts, scenarioAlerts } from '../data/alerts';
import { delay } from './delay';
export const getAlerts = (scenario = null, intensity = 1) =>
  delay([...(scenario && intensity >= 0.5 ? scenarioAlerts[scenario] || [] : []), ...baseAlerts], 60);
