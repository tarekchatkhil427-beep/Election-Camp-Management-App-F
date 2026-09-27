import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Users, MessageSquare, MoreHorizontal, Settings, Megaphone, AlertCircle, Share2, Database } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { useAuth } from '@/auth/MockAuthProvider';

export function MobileNav() {
  const { user } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const mainLinks = [
    { name: 'Home', to: '/', icon: Home, exact: true },
    { name: 'Tasks', to: user?.role === 'VOLUNTEER' ? '/tasks/my-tasks' : '/tasks', icon: CheckSquare },
    { name: 'Org Tree', to: '/organization', icon: Users, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR', 'HOUSE_COORDINATOR'] },
    { name: 'Messages', to: '/messages', icon: MessageSquare },
  ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

  const moreLinks = [
    { name: 'Org Settings', to: '/organization/settings', icon: Settings, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR'] },
    { name: 'Voters', to: '/voters', icon: Database, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR'] },
    { name: 'Issues', to: '/issues', icon: AlertCircle },
    { name: 'Social', to: '/social', icon: Share2, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR'] },
    { name: 'Notifications', to: '/notifications', icon: Megaphone },
    { name: 'Settings', to: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'CAMPAIGN_DIRECTOR'] },
  ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50 px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)] dark:shadow-none">
      {mainLinks.map(link => (
        <NavLink
          key={link.name}
          to={link.to}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <link.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{link.name}</span>
        </NavLink>
      ))}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button className="flex flex-col items-center justify-center w-16 h-full gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-xl px-4 py-6">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle>More Menu</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {moreLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setSheetOpen(false)}
                className={({ isActive }) => cn(
                  "flex flex-col items-center gap-2",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center bg-muted/50 transition-colors",
                )}>
                  <link.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">{link.name}</span>
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
