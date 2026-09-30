import { deliveries } from '../data/deliveries';
import { delay } from './delay';
export const getDeliveries = () => delay(deliveries);
