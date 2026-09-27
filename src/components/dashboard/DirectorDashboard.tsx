import React from 'react';
import { AlertCircle, CheckSquare, Clock, Users, Activity, Flag } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActivityFeed, TaskListWidget } from './SharedWidgets';

export function DirectorDashboard() {
  const mockActivity = [
    { id: '1', title: 'Ward 03 coordinator requested additional leaflets', timestamp: '1 hour ago', type: 'task' as const },
    { id: '2', title: 'Volunteer training session completed', timestamp: '3 hours ago', type: 'event' as const },
    { id: '3', title: 'Critical issue reported in Ward 01', timestamp: '4 hours ago', type: 'issue' as const },
  ];

  const mockTasks = [
    { id: '1', title: 'Resolve Ward 01 critical dispute', status: 'overdue' as const, dueDate: 'Yesterday' },
    { id: '2', title: 'Approve volunteer assignments', status: 'pending' as const, dueDate: 'Today, 2:00 PM' },
    { id: '3', title: 'Review weekly progress report', status: 'pending' as const, dueDate: 'Tomorrow, 9:00 AM' },
    { id: '4', title: 'Coordinate with media team', status: 'in_progress' as const, dueDate: 'Today, 4:00 PM' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Operational Control</h2>
        <p className="text-muted-foreground mt-1">Campaign Director oversight and action items.</p>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tasks in Progress" 
          value="45" 
          icon={Activity} 
          colorClassName="bg-blue-500" 
          to="/tasks"
        />
        <StatCard 
          title="Overdue Tasks" 
          value="12" 
          icon={Clock} 
          colorClassName="bg-red-500" 
          trend={{ value: 4, isPositive: false }}
          description="vs last week"
          to="/tasks"
        />
        <StatCard 
          title="Pending Approvals" 
          value="23" 
          icon={CheckSquare} 
          colorClassName="bg-amber-500" 
          to="/activity"
        />
        <StatCard 
          title="Active Issues" 
          value="18" 
          icon={AlertCircle} 
          colorClassName="bg-orange-500" 
          to="/issues"
        />
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2">
        <StatCard 
          title="Ward Activity Score" 
          value="87/100" 
          icon={Flag} 
          colorClassName="bg-indigo-500" 
          description="Healthy engagement across 12 wards"
          to="/organization"
        />
        <StatCard 
          title="Volunteer Deployment" 
          value="92%" 
          icon={Users} 
          colorClassName="bg-emerald-500" 
          description="Of target goal"
          to="/organization"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <TaskListWidget tasks={mockTasks} />
        <ActivityFeed items={mockActivity} />
      </div>
    </div>
  );
}
