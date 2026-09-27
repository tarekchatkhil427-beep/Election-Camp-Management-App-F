import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MockAuthProvider } from '@/auth/MockAuthProvider';
import { Shell } from '@/components/layout/Shell';
import { DemoRoleSwitcher } from '@/components/dev/DemoRoleSwitcher';
import Dashboard from '@/features/dashboard/Dashboard';

import OrganizationHierarchy from '@/features/organization/OrganizationHierarchy';
import OrganizationSettings from '@/features/organization/OrganizationSettings';
import HouseList from '@/features/organization/HouseList';
import HouseDetail from '@/features/organization/HouseDetail';
import VoterDatabase from '@/features/voters/VoterDatabase';
import OperationsLayout from '@/features/operations/OperationsLayout';
import TaskManagement from '@/features/operations/TaskManagement';
import EventsList from '@/features/operations/EventsList';
import CalendarView from '@/features/operations/CalendarView';
import ApprovalCenter from '@/features/operations/ApprovalCenter';
import IssuesDashboard from '@/features/issues/IssuesDashboard';
import SocialMediaLayout from '@/features/social/SocialMediaLayout';
import CampaignsList from '@/features/social/CampaignsList';
import CampaignWorkspace from '@/features/social/CampaignWorkspace';
import SocialCalendar from '@/features/social/SocialCalendar';
import MessagesDashboard from '@/features/messages/MessagesDashboard';
import ActivityCenter from '@/features/activity/ActivityCenter';
import Notifications from '@/features/notifications/Notifications';
import SettingsLayout from '@/features/settings/SettingsLayout';
import GeneralSettings from '@/features/settings/GeneralSettings';
import UserManagement from '@/features/settings/UserManagement';
import RolesPermissions from '@/features/settings/RolesPermissions';
import SecuritySettings from '@/features/settings/SecuritySettings';

import { ProtectedRoute } from '@/auth/ProtectedRoute';

function App() {
  return (
    <MockAuthProvider>
      <Toaster position="bottom-right" richColors toastOptions={{ style: { animationDuration: '200ms' } }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Shell />}>
            <Route index element={<Dashboard />} />
            
            {/* Organization Module Routes (Admin & Coordinators) */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR', 'HOUSE_COORDINATOR']} />}>
              <Route path="organization">
                <Route index element={<OrganizationHierarchy />} />
                <Route path="settings" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR']}>
                    <OrganizationSettings />
                  </ProtectedRoute>
                } />
                <Route path="wards/:wardId/houses" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR']}>
                    <HouseList />
                  </ProtectedRoute>
                } />
                <Route path="houses/:houseId" element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR', 'HOUSE_COORDINATOR']}>
                    <HouseDetail />
                  </ProtectedRoute>
                } />
              </Route>
            </Route>
            
            {/* Voter Database (Admin & Directors only for full db) */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR']} />}>
              <Route path="voters" element={<VoterDatabase />} />
            </Route>

            {/* Operations Module Routes */}
            <Route element={<OperationsLayout />}>
              <Route path="tasks" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR', 'HOUSE_COORDINATOR']}>
                  <TaskManagement />
                </ProtectedRoute>
              } />
              <Route path="tasks/my-tasks" element={<TaskManagement personalView={true} />} />
              <Route path="events" element={<EventsList />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="approvals" element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR']}>
                  <ApprovalCenter />
                </ProtectedRoute>
              } />
            </Route>

            {/* Issues (All users) */}
            <Route path="issues" element={<IssuesDashboard />} />
            
            {/* Social Media Module (Admin & Communication teams) */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR']} />}>
              <Route path="social" element={<SocialMediaLayout />}>
                <Route index element={<CampaignsList />} />
                <Route path="campaigns" element={<CampaignsList />} />
                <Route path="campaigns/:campaignId" element={<CampaignWorkspace />} />
                <Route path="calendar" element={<SocialCalendar />} />
              </Route>
            </Route>

            {/* Messages (All users) */}
            <Route path="messages" element={<MessagesDashboard />} />
            
            {/* Activity (Admin & Directors) */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR']} />}>
              <Route path="activity" element={<ActivityCenter />} />
            </Route>
            
            {/* Settings Module Routes (Admin only) */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CAMPAIGN_DIRECTOR']} />}>
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<GeneralSettings />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="roles" element={<RolesPermissions />} />
                <Route path="security" element={<SecuritySettings />} />
              </Route>
            </Route>

            {/* Notifications (All users) */}
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MockAuthProvider>
  );
}

export default App;
