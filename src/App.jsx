import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import HowItWorks from './pages/HowItWorks';
import AppLayout from './layouts/AppLayout';
import { LoadingState, Button } from './components/ui';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LiveMap = lazy(() => import('./pages/LiveMap'));
const RoutesPage = lazy(() => import('./pages/RoutesPage'));
const RouteDetail = lazy(() => import('./pages/RouteDetail'));
const Vehicles = lazy(() => import('./pages/Vehicles'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Logistics = lazy(() => import('./pages/Logistics'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const Reports = lazy(() => import('./pages/Reports'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Simulation = lazy(() => import('./pages/Simulation'));
const Impact = lazy(() => import('./pages/Impact'));
const Settings = lazy(() => import('./pages/Settings'));

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
const NotFound = () => (
  <div className="state" style={{ minHeight: '60vh' }}>
    <h2>Page not found</h2><p>That page does not exist.</p>
    <Button as={Link} to="/">Back to home</Button>
  </div>
);

export default function App() {
  return (
    <>
      <ScrollTop />
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="routes/:id" element={<RouteDetail />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="logistics" element={<Logistics />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="simulation" element={<Simulation />} />
            <Route path="impact" element={<Impact />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
