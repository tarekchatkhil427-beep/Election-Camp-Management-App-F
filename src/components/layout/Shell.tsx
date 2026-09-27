import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  CheckSquare, 
  AlertCircle, 
  MessageSquare, 
  Bell, 
  Settings, 
  Activity,
  Menu,
  Search,
  Plus,
  Share2,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth, mockUsers } from '@/auth/MockAuthProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { MobileNav } from '@/components/layout/MobileNav';

export function Shell() {
  const { t, i18n } = useTranslation();
  const { user, switchUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const navigation = [
    { name: t('Dashboard'), to: '/', icon: LayoutDashboard },
    { name: t('Org Tree'), to: '/organization', icon: Users, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR', 'HOUSE_COORDINATOR'] },
    { name: t('Org Settings'), to: '/organization/settings', icon: Settings, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR'] },
    { name: t('Voter Database'), to: '/voters', icon: Database, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR'] },
    { name: t('Tasks & Events'), to: user?.role === 'VOLUNTEER' ? '/tasks/my-tasks' : '/tasks', icon: CheckSquare },
    { name: t('Community Issues'), to: '/issues', icon: AlertCircle },
    { name: t('Social Media'), to: '/social', icon: Share2, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR'] },
    { name: t('Messages'), to: '/messages', icon: MessageSquare },
    { name: t('Activity'), to: '/activity', icon: Activity, roles: ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR', 'WARD_COORDINATOR'] },
    { name: t('Settings'), to: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'CAMPAIGN_DIRECTOR'] },
  ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <div className="flex h-screen w-full bg-secondary overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 hidden md:flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-border justify-between">
          {sidebarOpen && <span className="font-bold text-lg text-primary tracking-tight">CampaignOS</span>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
          {/* Mobile Header Elements */}
          <div className="flex items-center md:hidden gap-3 mr-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="h-16 flex items-center px-6 border-b border-border">
                  <span className="font-bold text-lg text-primary tracking-tight">CampaignOS</span>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg text-primary tracking-tight">CampaignOS</span>
          </div>

          <div className="flex items-center flex-1 gap-6">
            {/* Search */}
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <div
                className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-muted/30 text-sm flex items-center justify-between cursor-text hover:bg-muted/50 transition-colors text-muted-foreground"
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              >
                <span>{t('Search Wards, Tasks, Issues...')}</span>
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} title={t('Language')}>
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Toggle language</span>
              <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-primary text-primary-foreground rounded px-0.5">{i18n.language === 'en' ? 'EN' : 'BN'}</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} title={t('Theme')}>
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>

            <Button variant="default" size="sm" className="gap-2 hidden sm:flex">
              <Plus className="h-4 w-4" />
              <span>{t('Quick Create')}</span>
            </Button>

            <NavLink to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card"></span>
              </Button>
            </NavLink>

            {/* Mock Role Switcher / Profile */}
            <div className="flex items-center gap-3 border-l border-border pl-2 sm:pl-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium leading-none">{user?.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{user?.role.replace('_', ' ')}</span>
              </div>
              <select 
                className="h-9 sm:h-10 rounded-md border border-input bg-background text-xs sm:text-sm px-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-ring max-w-[100px] sm:max-w-[120px]"
                value={user?.id}
                onChange={(e) => {
                  const newUser = mockUsers.find(u => u.id === e.target.value);
                  if (newUser) switchUser(newUser);
                }}
              >
                {mockUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.role}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="mt-8 pt-4 text-center text-xs text-muted-foreground opacity-70 hover:opacity-100 transition-opacity">
            Made by <a href="https://www.nextgensoftbd.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">NextGensoftBd</a>
          </footer>
        </main>
      </div>

      <CommandPalette />
      <MobileNav />
    </div>
  );
}
