import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardHome } from './DashboardHome';
import { DashboardTickets } from './DashboardTickets';
import { DashboardOrganise } from './DashboardOrganise';
import { DashboardSettings } from './DashboardSettings';
import { DashboardNotifications } from './DashboardNotifications';
import { DashboardHelp } from './DashboardHelp';
import { DashboardSingleEvent } from './DashboardSingleEvent';
import { DashboardWatchEvent } from './DashboardWatchEvent';
import { DashboardEventAnalytics } from './DashboardEventAnalytics';

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
      <Route index element={<Navigate to="/dashboard/home" replace />} />
        <Route path='home' element={<DashboardHome />} />
        <Route path="tickets" element={<DashboardTickets />} />
        <Route path="organise" element={<DashboardOrganise />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="help" element={<DashboardHelp />} />
        <Route path="tickets/event/:id" element={<DashboardSingleEvent />} />
        <Route path="tickets/watch-event/:id" element={<DashboardWatchEvent />} />
        <Route path="organise/analytics/:id" element={<DashboardEventAnalytics />} />
      </Routes>
    </DashboardLayout>
  );
};