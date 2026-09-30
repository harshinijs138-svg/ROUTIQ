import { routes } from '../data/routes';
import { evaluateRoute } from '../utils/risk';
import { delay } from './delay';
export const getRawRoutes = () => delay(routes);
export const getRoutes = (scenario = null, intensity = 1) => delay(routes.map((r) => evaluateRoute(r, scenario, intensity)));
