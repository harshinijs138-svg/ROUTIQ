// DEMO / SIMULATED route data. Base factors describe normal conditions; exposure scales each scenario's effect.
export const routes = [
  { id: 'A', name: 'Route A', via: 'NH-6 direct via Nongpoh and Umiam', from: 'Guwahati', to: 'Shillong', distance: 99, baseEta: 266,
    base: { rainfall: 20, flood: 10, landslide: 45, traffic: 20, road: 58 },
    exposure: { rainfall: 1.4, flood: 0.5, landslide: 0.9, closure: 0.8, traffic: 0.6 },
    path: [[26.1445, 91.7362], [26.1146, 91.8531], [25.9013, 91.87], [25.6633, 91.8925], [25.5788, 91.8933]] },
  { id: 'B', name: 'Route B', via: 'Eastern loop via Byrnihat', from: 'Guwahati', to: 'Shillong', distance: 132, baseEta: 306,
    base: { rainfall: 29, flood: 16, landslide: 6, traffic: 10, road: 11 },
    exposure: { rainfall: 0.55, flood: 0.4, landslide: 0.5, closure: 0.3, traffic: 0.5 },
    path: [[26.1445, 91.7362], [26.02, 91.97], [25.85, 92.02], [25.7, 91.99], [25.57, 91.93], [25.5788, 91.8933]] },
  { id: 'C', name: 'Route C', via: 'Western bypass via Jagiroad side road', from: 'Guwahati', to: 'Shillong', distance: 141, baseEta: 321,
    base: { rainfall: 43, flood: 38, landslide: 6, traffic: 11, road: 17 },
    exposure: { rainfall: 0.7, flood: 0.8, landslide: 0.4, closure: 0.3, traffic: 0.4 },
    path: [[26.1445, 91.7362], [26.05, 91.62], [25.85, 91.6], [25.68, 91.74], [25.59, 91.85], [25.5788, 91.8933]] },
  { id: 'D', name: 'Route D', via: 'Upgraded corridor via Barapani', from: 'Guwahati', to: 'Shillong', distance: 98, baseEta: 206,
    base: { rainfall: 8, flood: 5, landslide: 4, traffic: 10, road: 14 },
    exposure: { rainfall: 0.3, flood: 0.2, landslide: 0.25, closure: 0.15, traffic: 0.3 },
    path: [[26.1445, 91.7362], [26.0, 91.9], [25.8, 91.91], [25.62, 91.9], [25.5788, 91.8933]] },
];
