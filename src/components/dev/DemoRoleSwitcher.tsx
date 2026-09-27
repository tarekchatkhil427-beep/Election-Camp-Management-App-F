import React, { useState, useEffect } from 'react';
import { UserCircle, Shield, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useAuth, MockRole } from '@/auth/MockAuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ROLES: { label: string; value: MockRole }[] = [
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Candidate', value: 'CANDIDATE' },
  { label: 'Campaign Director', value: 'CAMPAIGN_DIRECTOR' },
  { label: 'Ward Coordinator', value: 'WARD_COORDINATOR' },
  { label: 'House Coordinator', value: 'HOUSE_COORDINATOR' },
  { label: 'Volunteer', value: 'VOLUNTEER' }
];

export function DemoRoleSwitcher() {
  const { user, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col items-start shadow-2xl rounded-xl">
      {isOpen && (
        <div className="bg-card border border-border rounded-xl mb-2 w-64 overflow-hidden shadow-xl animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/30">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3 w-3" /> Dev Role Switcher
            </span>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-col p-2 space-y-1">
            {ROLES.map(role => (
              <Button
                key={role.value}
                variant={user?.role === role.value ? 'default' : 'ghost'}
                size="sm"
                className={cn("justify-start text-xs", user?.role === role.value ? 'font-semibold' : 'font-normal')}
                onClick={() => {
                  switchUser({
                    id: `demo-${role.value.toLowerCase().replace('_', '-')}`,
                    name: `Mock ${role.label}`,
                    role: role.value,
                    scope: role.value.includes('WARD') || role.value.includes('HOUSE') || role.value === 'VOLUNTEER' ? { wardId: 'w-01', houseId: 'h-01' } : undefined
                  });
                  setIsOpen(false);
                }}
              >
                {role.label}
              </Button>
            ))}
          </div>
          <div className="p-2 border-t border-border/50 text-[10px] text-muted-foreground text-center bg-muted/10">
            Press <kbd className="px-1 bg-muted rounded border border-border">Ctrl+Shift+D</kbd> to hide
          </div>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-10 px-3 rounded-full shadow-lg border-primary/20 hover:bg-primary/5 transition-all flex items-center gap-2 font-medium backdrop-blur-sm bg-background/80",
          isOpen && "bg-primary/10 border-primary/30"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Badge variant="destructive" className="h-5 px-1.5 text-[9px] uppercase tracking-wider animate-pulse">Demo Mode</Badge>
        <div className="flex items-center gap-1.5 border-l border-border pl-2">
          <UserCircle className="h-4 w-4 text-primary" />
          <span className="text-xs truncate max-w-[120px]">{ROLES.find(r => r.value === user?.role)?.label || 'Switch Role'}</span>
          {isOpen ? <ChevronDown className="h-3 w-3 opacity-50" /> : <ChevronUp className="h-3 w-3 opacity-50" />}
        </div>
      </Button>
    </div>
  );
}
