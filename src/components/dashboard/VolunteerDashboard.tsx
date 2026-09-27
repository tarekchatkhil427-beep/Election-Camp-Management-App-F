import React from 'react';
import { CheckSquare, Calendar, Bell, Flag, MapPin } from 'lucide-react';
import { StatCard } from './StatCard';
import { TaskListWidget } from './SharedWidgets';
import { useAuth } from '@/auth/MockAuthProvider';

export function VolunteerDashboard() {
  const { user } = useAuth();

  const mockTasks = [
    { id: '1', title: 'Visit House 12 for voter confirmation', status: 'pending' as const, dueDate: 'Today, 2:00 PM' },
    { id: '2', title: 'Distribute leaflets in Block A', status: 'pending' as const, dueDate: 'Tomorrow, 10:00 AM' },
  ];

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome, {user?.name}</h2>
          <p className="text-muted-foreground mt-1">Here is your daily action plan.</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto text-sm text-muted-foreground flex-col sm:flex-row">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Ward: {user?.scope?.wardId}</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> House: {user?.scope?.houseId}</span>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard 
          title="My Tasks" 
          value="2 Pending" 
          icon={CheckSquare} 
          colorClassName="bg-amber-500" 
          to="/tasks"
        />
        <StatCard 
          title="My Events" 
          value="1 Upcoming" 
          icon={Calendar} 
          colorClassName="bg-purple-500" 
          to="/tasks"
        />
        <StatCard 
          title="Notifications" 
          value="3 Unread" 
          icon={Bell} 
          colorClassName="bg-blue-500" 
          to="/activity"
        />
        <StatCard 
          title="Report Issue" 
          value="File Report" 
          icon={Flag} 
          colorClassName="bg-red-500" 
          to="/issues"
        />
      </div>

      <div className="mt-8">
        <TaskListWidget tasks={mockTasks} />
      </div>
    </div>
  );
}
