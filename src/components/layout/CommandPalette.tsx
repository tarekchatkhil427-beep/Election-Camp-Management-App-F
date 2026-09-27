import React, { useEffect, useState } from 'react';
import { Search, Folder, CheckSquare, AlertCircle, Calendar, Users, MapPin, MessageSquare, Megaphone, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/auth/MockAuthProvider';

const mockGlobalData = [
  { id: 'w1', title: 'Ward 03 — Abdul Karim', type: 'Ward', route: '/organization', icon: MapPin },
  { id: 'h1', title: 'House 01', type: 'House', route: '/organization/wards/w3/houses', icon: Home },
  { id: 'h2', title: 'House 02', type: 'House', route: '/organization/wards/w3/houses', icon: Home },
  { id: 't1', title: 'Community meeting setup', type: 'Task', route: '/tasks', icon: CheckSquare },
  { id: 't2', title: 'Distribute flyers in Block A', type: 'Task', route: '/tasks', icon: CheckSquare },
  { id: 'i1', title: 'Road repair pending', type: 'Issue', route: '/issues', icon: AlertCircle },
  { id: 'e1', title: 'Townhall Rally', type: 'Event', route: '/events', icon: Calendar },
  { id: 'u1', title: 'Alif Hossain (Volunteer)', type: 'User', route: '/settings/users', icon: Users },
  { id: 'c1', title: 'Clean Village Initiative', type: 'Campaign', route: '/social/campaigns', icon: Folder },
];

export function CommandPalette() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (route: string) => {
    setOpen(false);
    navigate(route);
  };

  const allowedToSee = (item: typeof mockGlobalData[0]) => {
    if (!user) return false;
    
    // Volunteers cannot see Settings, Users, Campaigns
    if (user.role === 'VOLUNTEER') {
      if (['User', 'Campaign', 'Ward'].includes(item.type)) return false;
      
      // Override task routes for volunteers
      if (item.type === 'Task') item.route = '/tasks/my-tasks';
    }
    
    // Restrict settings
    if (item.type === 'User' && !['SUPER_ADMIN', 'CAMPAIGN_DIRECTOR'].includes(user.role)) return false;
    
    return true;
  };

  const results = mockGlobalData
    .filter(allowedToSee)
    .filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
  
  // Group results
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof mockGlobalData>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden shadow-2xl rounded-xl border-border bg-card/95 backdrop-blur-md">
        <div className="flex items-center px-4 border-b border-border/50">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Wards, Houses, Tasks, Issues... (Ctrl+K)" 
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base h-14 bg-transparent"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ESC
          </kbd>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-14 text-center text-sm text-muted-foreground">
              No results found for "{query}".
            </div>
          ) : (
            Object.entries(groupedResults).map(([type, items]) => (
              <div key={type} className="mb-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {type}s
                </div>
                {items.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleSelect(item.route)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    {item.title}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
