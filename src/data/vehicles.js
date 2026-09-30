// DEMO / SIMULATED GPS. `from`/`to` are [lat,lng]; `p` is progress 0..1.
export const vehicles = [
  { id: 'VH-001', type: 'Medical Supply Truck', origin: 'Guwahati', destination: 'Shillong', from: [26.1445, 91.7362], to: [25.5788, 91.8933], p: 0.55, speed: 42, etaMin: 138, routeId: 'B', baseRisk: 'medium', departed: '06:40' },
  { id: 'VH-002', type: 'Relief Supplies Van', origin: 'Dibrugarh', destination: 'Itanagar', from: [27.4728, 94.912], to: [27.0844, 93.6053], p: 0.35, speed: 51, etaMin: 245, routeId: null, baseRisk: 'low', departed: '05:55' },
  { id: 'VH-003', type: 'Fuel Tanker', origin: 'Guwahati', destination: 'Shillong', from: [26.1445, 91.7362], to: [25.5788, 91.8933], p: 0.3, speed: 38, etaMin: 190, routeId: 'A', baseRisk: 'medium', delayedIn: ['rainfall', 'landslide', 'closure'], departed: '07:15' },
  { id: 'VH-004', type: 'Cold Chain Truck', origin: 'Silchar', destination: 'Agartala', from: [24.8333, 92.7789], to: [23.8315, 91.2868], p: 0.45, speed: 47, etaMin: 320, routeId: null, baseRisk: 'medium', departed: '04:30' },
  { id: 'VH-005', type: 'Grain Carrier', origin: 'Imphal', destination: 'Kohima', from: [24.817, 93.9368], to: [25.6751, 94.1086], p: 0.6, speed: 35, etaMin: 225, routeId: null, baseRisk: 'medium', departed: '05:10' },
  { id: 'VH-006', type: 'Parcel Van', origin: 'Kohima', destination: 'Dimapur', from: [25.6751, 94.1086], to: [25.9063, 93.7276], p: 1, speed: 0, etaMin: 0, routeId: null, baseRisk: 'low', delivered: true, departed: '03:50' },
];
