import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function SettingsLayout() {
  const location = useLocation();

  const tabs = [
    { name: 'General', to: '/settings', exact: true },
    { name: 'User Management', to: '/settings/users' },
    { name: 'Roles & Permissions', to: '/settings/roles' },
    { name: 'Security', to: '/settings/security' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-8 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage campaign preferences, users, permissions, and security.</p>
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
