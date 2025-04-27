import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardHome } from './DashboardHome';
import { DashboardTickets } from './DashboardTickets';
import { DashboardOrganise } from './DashboardOrganise';
import { DashboardSettings } from './DashboardSettings';
import { DashboardNotifications } from './DashboardNotifications';
import { DashboardHelp } from './DashboardHelp';

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="tickets" element={<DashboardTickets />} />
        <Route path="organise" element={<DashboardOrganise />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="help" element={<DashboardHelp />} />
      </Routes>
    </DashboardLayout>
  );
};