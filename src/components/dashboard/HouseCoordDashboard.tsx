import React from 'react';
import { Users, UserCheck, Calendar, CheckCircle2, Flag } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActivityFeed, TaskListWidget } from './SharedWidgets';
import { useAuth } from '@/auth/MockAuthProvider';

export function HouseCoordDashboard() {
  const { user } = useAuth();

  const mockActivity = [
    { id: '1', title: 'Voter data updated for Block C', timestamp: '1 hour ago', type: 'voter' as const },
    { id: '2', title: 'Upcoming block meeting scheduled', timestamp: '3 hours ago', type: 'event' as const },
  ];

  const mockTasks = [
    { id: '1', title: 'Verify voter addresses in Block A', status: 'pending' as const, dueDate: 'Today, 4:00 PM' },
    { id: '2', title: 'Distribute campaign materials', status: 'in_progress' as const, dueDate: 'Tomorrow, 12:00 PM' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">House Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview for House Coordinator: {user?.name}</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
            Ward: {user?.scope?.wardId || 'Unassigned'}
          </span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
            House: {user?.scope?.houseId || 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Assigned Volunteers" 
          value="7" 
          icon={Users} 
          colorClassName="bg-blue-500" 
          to="/organization"
        />
        <StatCard 
          title="Voter Records" 
          value="450" 
          icon={UserCheck} 
          colorClassName="bg-emerald-500" 
          to="/voters"
        />
        <StatCard 
          title="Pending Tasks" 
          value="8" 
          icon={CheckCircle2} 
          colorClassName="bg-amber-500" 
          to="/tasks"
        />
        <StatCard 
          title="Events" 
          value="2" 
          icon={Calendar} 
          colorClassName="bg-purple-500" 
          to="/tasks"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TaskListWidget tasks={mockTasks} />
        </div>
        <div>
          <div className="mb-6">
            <StatCard 
              title="Reported Issues" 
              value="1" 
              icon={Flag} 
              colorClassName="bg-red-500" 
              to="/issues"
            />
          </div>
          <ActivityFeed items={mockActivity} />
        </div>
      </div>
    </div>
  );
}
