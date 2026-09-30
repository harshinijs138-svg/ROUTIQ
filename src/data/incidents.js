// DEMO / SIMULATED incidents. Always-on incidents plus incidents triggered by a scenario.
export const baseIncidents = [
  { id: 'INC-101', type: 'Flood', severity: 'medium', title: 'River overflow near Jorhat', location: 'Jorhat, Assam', lat: 26.75, lng: 94.2, routeId: null, minutesAgo: 95, desc: 'Water over the shoulder on a low-lying stretch. Single-lane passage only.' },
  { id: 'INC-102', type: 'Traffic Disruption', severity: 'low', title: 'Congestion at Silchar bypass', location: 'Silchar, Assam', lat: 24.83, lng: 92.78, routeId: null, minutesAgo: 60, desc: 'Slow movement due to roadworks. Expect 20 minute delays.' },
  { id: 'INC-103', type: 'Heavy Rainfall', severity: 'medium', title: 'Rain band over Gangtok', location: 'Gangtok, Sikkim', lat: 27.33, lng: 88.61, routeId: null, minutesAgo: 120, desc: 'Steady rainfall reducing visibility on NH-10.' },
];

export const scenarioIncidents = {
  rainfall: [
    { id: 'INC-001', type: 'Road Blockage', severity: 'critical', title: 'Road blockage on Route A', location: 'Nongpoh, Meghalaya', lat: 25.9013, lng: 91.87, routeId: 'A', minutesAgo: 10, desc: 'Debris and water logging block both lanes. Vehicles are being held at the checkpoint.' },
    { id: 'INC-002', type: 'Heavy Rainfall', severity: 'high', title: 'Heavy rainfall near Shillong', location: 'Shillong corridor, Meghalaya', lat: 25.62, lng: 91.89, routeId: 'A', minutesAgo: 25, desc: 'Sustained heavy rain across the Shillong corridor with landslide exposure on hill sections.' },
  ],
  flood: [
    { id: 'INC-011', type: 'Flood', severity: 'high', title: 'Flooding at Jorabat junction', location: 'Jorabat, Assam', lat: 26.1146, lng: 91.8531, routeId: 'C', minutesAgo: 8, desc: 'Low-lying junction under water. Heavy vehicles cannot pass.' },
    { id: 'INC-012', type: 'Flood', severity: 'medium', title: 'Waterlogging near Byrnihat', location: 'Byrnihat, Meghalaya', lat: 26.02, lng: 91.87, routeId: 'B', minutesAgo: 22, desc: 'Standing water on the approach road.' },
  ],
  landslide: [
    { id: 'INC-021', type: 'Landslide', severity: 'critical', title: 'Landslide near Umiam', location: 'Umiam, Meghalaya', lat: 25.6633, lng: 91.8925, routeId: 'A', minutesAgo: 6, desc: 'Slope failure covering one lane on a hill section.' },
    { id: 'INC-022', type: 'Road Blockage', severity: 'high', title: 'Debris on hill road', location: 'Nongpoh, Meghalaya', lat: 25.9013, lng: 91.87, routeId: 'A', minutesAgo: 18, desc: 'Clearing crews are on site.' },
  ],
  closure: [
    { id: 'INC-031', type: 'Road Blockage', severity: 'critical', title: 'Road section closed on Route A', location: 'Nongpoh, Meghalaya', lat: 25.9013, lng: 91.87, routeId: 'A', minutesAgo: 5, desc: 'Authorities have closed the road for repairs.' },
    { id: 'INC-032', type: 'Traffic Disruption', severity: 'high', title: 'Diversion queue at Jorabat', location: 'Jorabat, Assam', lat: 26.1146, lng: 91.8531, routeId: 'A', minutesAgo: 12, desc: 'Vehicles diverted onto a single lane.' },
  ],
  traffic: [
    { id: 'INC-041', type: 'Traffic Disruption', severity: 'high', title: 'Severe congestion at Jorabat', location: 'Jorabat, Assam', lat: 26.1146, lng: 91.8531, routeId: 'A', minutesAgo: 9, desc: 'Long queues toward Meghalaya border.' },
    { id: 'INC-042', type: 'Traffic Disruption', severity: 'medium', title: 'Slow traffic at Byrnihat', location: 'Byrnihat, Meghalaya', lat: 26.02, lng: 91.87, routeId: 'B', minutesAgo: 30, desc: 'Toll plaza queue.' },
  ],
};
