// Simulated network latency so loading states are real. Swap for fetch() when a backend exists.
export const delay = (value, ms = 220) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
