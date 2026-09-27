import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { useAuth } from '@/auth/MockAuthProvider';

export default function OperationsLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const tabs = [
    { name: 'Tasks', to: '/tasks', exact: true, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR', 'HOUSE_COORDINATOR'] },
    { name: 'My Tasks', to: '/tasks/my-tasks' },
    { name: 'Events', to: '/events' },
    { name: 'Calendar', to: '/calendar' },
    { name: 'Approvals', to: '/approvals', roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR'] },
  ].filter(tab => !tab.roles || (user && tab.roles.includes(user.role)));

  return (
    <div className="max-w-[1600px] mx-auto pb-8 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Operations & Planning</h1>
        <p className="text-muted-foreground mt-1">Manage campaigns tasks, events, and approvals.</p>
      </div>

      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? location.pathname === tab.to 
              : location.pathname.startsWith(tab.to);

            return (
              <NavLink
                key={tab.name}
                to={tab.to}
                className={cn(
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground',
                  'whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors'
                )}
              >
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
