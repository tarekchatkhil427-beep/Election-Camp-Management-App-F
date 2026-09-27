import React from 'react';
import { Home, Users, CheckSquare, AlertCircle, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActivityFeed, TaskListWidget } from './SharedWidgets';
import { useAuth } from '@/auth/MockAuthProvider';

export function WardCoordDashboard() {
  const { user } = useAuth();
  
  const mockActivity = [
    { id: '1', title: 'House 02 team completed canvassing', timestamp: '30 mins ago', type: 'task' as const },
    { id: '2', title: 'New volunteer joined House 04', timestamp: '2 hours ago', type: 'voter' as const },
    { id: '3', title: 'Street light issue reported in Sector A', timestamp: 'Yesterday', type: 'issue' as const },
  ];

  const mockTasks = [
    { id: '1', title: 'Distribute updated voter lists to House Coords', status: 'pending' as const, dueDate: 'Today, 6:00 PM' },
    { id: '2', title: 'Follow up on Sector A issue', status: 'in_progress' as const, dueDate: 'Tomorrow, 10:00 AM' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Ward Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview for Ward Coordinator: {user?.name}</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20 self-start sm:self-auto">
          Ward: {user?.scope?.wardId || 'Unassigned'}
        </div>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <StatCard 
          title="Houses" 
          value="12" 
          icon={Home} 
          colorClassName="bg-blue-500" 
          to="/organization"
        />
        <StatCard 
          title="House Coordinators" 
          value="12" 
          icon={Users} 
          colorClassName="bg-indigo-500" 
          to="/organization"
        />
        <StatCard 
          title="Ward Volunteers" 
          value="84" 
          icon={TrendingUp} 
          colorClassName="bg-emerald-500" 
          to="/organization"
        />
        <StatCard 
          title="Pending Tasks" 
          value="15" 
          icon={CheckSquare} 
          colorClassName="bg-amber-500" 
          to="/tasks"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ActivityFeed items={mockActivity} />
        <div className="space-y-6">
          <StatCard 
            title="Open Ward Issues" 
            value="4" 
            icon={AlertCircle} 
            colorClassName="bg-red-500" 
            to="/issues"
          />
          <TaskListWidget tasks={mockTasks} />
        </div>
      </div>
    </div>
  );
}
