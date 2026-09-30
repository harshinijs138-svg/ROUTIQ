import { baseIncidents, scenarioIncidents } from '../data/incidents';
import { delay } from './delay';
export const getIncidents = (scenario = null, intensity = 1) =>
  delay([...(scenario && intensity > 0 ? scenarioIncidents[scenario] || [] : []), ...baseIncidents], 60);
