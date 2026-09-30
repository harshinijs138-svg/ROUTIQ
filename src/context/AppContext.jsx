import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getRawRoutes } from '../services/routeService';
import { getVehicles } from '../services/vehicleService';
import { getDeliveries } from '../services/deliveryService';
import { getIncidents } from '../services/incidentService';
import { getAlerts } from '../services/alertService';
import { evaluateRoute, recommend } from '../utils/risk';
import { baseIncidents } from '../data/incidents';

const Ctx = createContext(null);
// The app opens in a "live" state with heavy rainfall active so the dashboard has a story to tell.
const DEFAULT_SIM = { type: 'rainfall', intensity: 1 };
const store = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } },
  del: (k) => { try { sessionStorage.removeItem(k); } catch { /* ignore */ } },
};
const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
const hhmm = (base, add) => {
  const [h, m] = base.split(':').map(Number);
  const x = h * 60 + m + add;
  return `${String(Math.floor(x / 60) % 24).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
};

export function AppProvider({ children }) {
  const [boot, setBoot] = useState({ status: 'loading' });
  const [rawRoutes, setRawRoutes] = useState([]);
  const [baseVehicles, setBaseVehicles] = useState([]);
  const [rawDeliveries, setRawDeliveries] = useState([]);
  const [sim, setSim] = useState(DEFAULT_SIM);
  const [incidents, setIncidents] = useState([]);
  const [alertsRaw, setAlertsRaw] = useState([]);
  const [extraAlerts, setExtraAlerts] = useState([]);
  const [reroutes, setReroutes] = useState({});
  const [reports, setReports] = useState([]);
  const [online, setOnline] = useState(true);
  const [authed, setAuthed] = useState(() => store.get('routiq-auth') === '1');
  const [demo, setDemo] = useState({ active: false, step: 0, paused: false });

  const load = useCallback(() => {
    setBoot({ status: 'loading' });
    Promise.all([getRawRoutes(), getVehicles(), getDeliveries()])
      .then(([r, v, d]) => { setRawRoutes(r); setBaseVehicles(v); setRawDeliveries(d); setBoot({ status: 'ready' }); })
      .catch((e) => setBoot({ status: 'error', message: e.message }));
  }, []);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let live = true;
    Promise.all([getIncidents(sim.type, sim.intensity), getAlerts(sim.type, sim.intensity)]).then(([i, a]) => {
      if (live) { setIncidents(i); setAlertsRaw(a); }
    });
    return () => { live = false; };
  }, [sim]);

  // Simulated GPS: vehicles creep along their corridor.
  useEffect(() => {
    const t = setInterval(() => setBaseVehicles((vs) => vs.map((v) => (v.delivered ? v : { ...v, p: Math.min(0.97, v.p + 0.004) }))), 4000);
    return () => clearInterval(t);
  }, []);

  // Simulated sync: queued reports complete when the connection returns.
  useEffect(() => {
    if (!online || !reports.some((r) => r.status === 'Queued')) return undefined;
    const t = setTimeout(() => setReports((rs) => rs.map((r) => (r.status === 'Queued' ? { ...r, status: 'Synced' } : r))), 1500);
    return () => clearTimeout(t);
  }, [online, reports]);

  const routes = useMemo(() => rawRoutes.map((r) => evaluateRoute(r, sim.type, sim.intensity)), [rawRoutes, sim]);
  const baselineRoutes = useMemo(() => rawRoutes.map((r) => evaluateRoute(r, null)), [rawRoutes]);
  const recommended = useMemo(() => (routes.length ? recommend(routes) : null), [routes]);

  const vehicles = useMemo(() => baseVehicles.map((v) => {
    const routeId = reroutes[v.id] ?? v.routeId;
    const route = routes.find((r) => r.id === routeId);
    const rerouted = Boolean(reroutes[v.id]);
    const delayed = !v.delivered && !rerouted && sim.type && sim.intensity >= 0.5 && (v.delayedIn || []).includes(sim.type);
    const status = v.delivered ? 'Delivered' : delayed ? 'Delayed' : 'Moving';
    const speed = v.delivered ? 0 : delayed ? 18 : rerouted ? 46 : v.speed;
    const etaMin = v.delivered ? 0 : delayed ? v.etaMin + 95 : rerouted ? Math.round(v.etaMin * 0.85) : v.etaMin;
    const pos = [v.from[0] + (v.to[0] - v.from[0]) * v.p, v.from[1] + (v.to[1] - v.from[1]) * v.p];
    const risk = route ? route.level : v.baseRisk;
    const timeline = [
      { time: v.departed, label: 'Departed', detail: v.origin },
      { time: hhmm(v.departed, 20), label: 'Route entered', detail: route ? `${route.name} · ${route.via}` : 'Main corridor' },
      { time: hhmm(v.departed, 75), label: 'Risk changed', detail: `Risk is now ${risk}` },
      { time: 'Now', label: 'Current status', detail: rerouted ? `Rerouted via Route ${routeId}` : status },
    ];
    return { ...v, routeId, route, rerouted, status, speed, etaMin, pos, risk, timeline, lastUpdate: 'a few seconds ago' };
  }), [baseVehicles, reroutes, routes, sim]);

  const deliveries = useMemo(() => rawDeliveries.map((d) => {
    const v = vehicles.find((x) => x.id === d.vehicleId);
    const status = !v ? 'In Transit' : v.status === 'Delivered' ? 'Delivered' : v.status === 'Delayed' ? 'Delayed' : 'In Transit';
    return { ...d, status, vehicle: v, atRisk: Boolean(v && ['high', 'critical'].includes(v.risk) && status !== 'Delivered') };
  }), [rawDeliveries, vehicles]);

  const alerts = useMemo(() => [...extraAlerts, ...alertsRaw]
    .filter((a) => !(a.focus && reroutes[a.focus]))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.minutesAgo - b.minutesAgo), [extraAlerts, alertsRaw, reroutes]);

  const impact = useMemo(() => {
    const after = routes.find((r) => r.id === 'A');
    const before = baselineRoutes.find((r) => r.id === 'A');
    if (!after || !before) return null;
    const affected = incidents.filter((i) => !baseIncidents.some((b) => b.id === i.id)).length;
    const delayed = baseVehicles.filter((v) => !v.delivered && sim.type && (v.delayedIn || []).includes(sim.type)).length;
    return { before, after, affected, delayed, recommended, active: Boolean(sim.type) };
  }, [routes, baselineRoutes, incidents, baseVehicles, sim, recommended]);

  const setScenario = useCallback((type, intensity = 1) => setSim({ type, intensity }), []);
  const addAlert = useCallback((a) => setExtraAlerts((list) => [a, ...list.filter((x) => x.id !== a.id)]), []);
  const resetNetwork = useCallback(() => { setSim(DEFAULT_SIM); setReroutes({}); setExtraAlerts([]); }, []);
  const reroute = useCallback((vehicleId, routeId) => {
    setReroutes((m) => ({ ...m, [vehicleId]: routeId }));
    addAlert({ id: `AL-RR-${vehicleId}`, severity: 'low', title: `${vehicleId} rerouted via Route ${routeId}`, place: 'Guwahati → Shillong', minutesAgo: 0, focus: null });
  }, [addAlert]);

  const submitReport = useCallback((data) => {
    const id = `RPT-${String(Date.now()).slice(-5)}`;
    const queued = !online;
    setReports((r) => [{ id, ...data, status: queued ? 'Queued' : 'Submitted', at: new Date() }, ...r]);
    addAlert({ id: `AL-${id}`, severity: data.severity.toLowerCase(), title: `${data.type} reported`, place: data.location, minutesAgo: 0, focus: null });
    return { id, queued };
  }, [online, addAlert]);

  const login = useCallback(() => { store.set('routiq-auth', '1'); setAuthed(true); }, []);
  const logout = useCallback(() => { store.del('routiq-auth'); setAuthed(false); }, []);

  const startDemo = useCallback(() => { setReroutes({}); setExtraAlerts([]); setSim({ type: null, intensity: 1 }); setDemo({ active: true, step: 0, paused: false }); }, []);
  const exitDemo = useCallback(() => { setDemo({ active: false, step: 0, paused: false }); resetNetwork(); }, [resetNetwork]);

  const value = {
    boot, reload: load, routes, baselineRoutes, recommended, vehicles, deliveries, incidents, alerts, impact, reports,
    sim, scenario: sim.type, setScenario, resetNetwork, reroute, addAlert, submitReport,
    online, setOnline, authed, login, logout, demo, setDemo, startDemo, exitDemo,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}
