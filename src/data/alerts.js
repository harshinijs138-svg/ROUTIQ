export const baseAlerts = [
  { id: 'AL-100', severity: 'low', title: 'Scheduled maintenance on NH-27', place: 'Silchar corridor', minutesAgo: 180, focus: 'INC-102' },
];

export const scenarioAlerts = {
  rainfall: [
    { id: 'AL-001', severity: 'critical', title: 'Road blockage on Route A', place: 'Nongpoh, Meghalaya', minutesAgo: 10, focus: 'INC-001', routeId: 'A' },
    { id: 'AL-002', severity: 'high', title: 'Heavy rainfall near Shillong', place: 'Shillong corridor', minutesAgo: 25, focus: 'INC-002', routeId: 'A' },
    { id: 'AL-003', severity: 'medium', title: 'Vehicle VH-003 delayed', place: 'Route A', minutesAgo: 40, focus: 'VH-003', routeId: 'A' },
  ],
  flood: [
    { id: 'AL-011', severity: 'high', title: 'Flooding at Jorabat junction', place: 'Jorabat, Assam', minutesAgo: 8, focus: 'INC-011', routeId: 'C' },
    { id: 'AL-012', severity: 'medium', title: 'Waterlogging near Byrnihat', place: 'Byrnihat, Meghalaya', minutesAgo: 22, focus: 'INC-012', routeId: 'B' },
  ],
  landslide: [
    { id: 'AL-021', severity: 'critical', title: 'Landslide near Umiam', place: 'Umiam, Meghalaya', minutesAgo: 6, focus: 'INC-021', routeId: 'A' },
    { id: 'AL-022', severity: 'medium', title: 'Vehicle VH-003 delayed', place: 'Route A', minutesAgo: 20, focus: 'VH-003', routeId: 'A' },
  ],
  closure: [
    { id: 'AL-031', severity: 'critical', title: 'Road section closed on Route A', place: 'Nongpoh, Meghalaya', minutesAgo: 5, focus: 'INC-031', routeId: 'A' },
    { id: 'AL-032', severity: 'medium', title: 'Vehicle VH-003 delayed', place: 'Route A', minutesAgo: 15, focus: 'VH-003', routeId: 'A' },
  ],
  traffic: [
    { id: 'AL-041', severity: 'high', title: 'Severe congestion at Jorabat', place: 'Jorabat, Assam', minutesAgo: 9, focus: 'INC-041', routeId: 'A' },
  ],
};
