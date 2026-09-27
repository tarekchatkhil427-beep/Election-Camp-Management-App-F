import React, { useState } from 'react';
import { Activity, UserPlus, CheckCircle2, PlusCircle, AlertCircle, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockActivities = [
  { id: 'a-1', time: '10:42 PM', user: 'Rahim', action: 'added a volunteer', module: 'Organization', icon: UserPlus, dateGroup: 'Today' },
  { id: 'a-2', time: '10:36 PM', user: 'Campaign Director', action: 'approved an event', module: 'Events', icon: CheckCircle2, dateGroup: 'Today' },
  { id: 'a-3', time: '10:21 PM', user: 'Ward 03', action: 'created a task', module: 'Tasks', icon: PlusCircle, dateGroup: 'Today' },
  { id: 'a-4', time: '09:52 PM', user: 'System', action: 'New community issue submitted', module: 'Issues', icon: AlertCircle, dateGroup: 'Today' },
  { id: 'a-5', time: '04:15 PM', user: 'Jane Director', action: 'updated the campaign logo', module: 'Settings', icon: Activity, dateGroup: 'Yesterday' },
  { id: 'a-6', time: '02:30 PM', user: 'House Coordinator 07', action: 'marked 5 voters as contacted', module: 'Voters', icon: CheckCircle2, dateGroup: 'Yesterday' },
];

export default function ActivityCenter() {
  const [filterOpen, setFilterOpen] = useState(false);

  const dateGroups = Array.from(new Set(mockActivities.map(a => a.dateGroup)));

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Activity Center
          </h1>
          <p className="text-muted-foreground mt-1">A chronological timeline of all campaign operations.</p>
        </div>
        <Button variant={filterOpen ? "default" : "outline"} className="gap-2" onClick={() => setFilterOpen(!filterOpen)}>
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {filterOpen && (
        <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option>All Users</option>
            <option>Campaign Director</option>
            <option>Ward Coordinators</option>
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option>All Modules</option>
            <option>Tasks</option>
            <option>Events</option>
            <option>Issues</option>
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option>All Actions</option>
            <option>Creates</option>
            <option>Updates</option>
            <option>Deletes</option>
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option>Any Date</option>
            <option>Today</option>
            <option>Last 7 Days</option>
          </select>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6 relative">
        <div className="absolute left-[39px] top-6 bottom-6 w-px bg-border/50 hidden sm:block" />
        
        {dateGroups.map((group, groupIdx) => (
          <div key={group} className={cn("mb-8 relative", groupIdx === dateGroups.length - 1 && "mb-0")}>
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">{group}</Badge>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="space-y-6">
              {mockActivities.filter(a => a.dateGroup === group).map((activity) => (
                <div key={activity.id} className="group flex gap-4 relative">
                  <div className="w-16 shrink-0 text-right pt-1 hidden sm:block">
                    <span className="text-xs font-medium text-muted-foreground">{activity.time}</span>
                  </div>
                  
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10 text-primary">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 pt-1 pb-4 border-b border-border/50 group-last:border-0 group-last:pb-0">
                    <p className="text-sm">
                      <span className="font-semibold text-foreground">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="sm:hidden text-[10px] font-medium text-muted-foreground">{activity.time}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-muted/50">{activity.module}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
