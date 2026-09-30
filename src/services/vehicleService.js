import { vehicles } from '../data/vehicles';
import { delay } from './delay';
export const getVehicles = () => delay(vehicles.map((v) => ({ ...v })));
