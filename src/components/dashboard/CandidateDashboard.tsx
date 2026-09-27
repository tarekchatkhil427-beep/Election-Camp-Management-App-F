import React from 'react';
import { Users, MapPin, Home, CheckSquare, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard } from './StatCard';
import { ActivityFeed, TaskListWidget } from './SharedWidgets';

export function CandidateDashboard() {
  const { t } = useTranslation();

  const mockActivity = [
    { id: '1', title: 'New house coordinator assigned to Ward 04', timestamp: '2 hours ago', type: 'voter' as const },
    { id: '2', title: 'Community meeting scheduled at Central Park', timestamp: '4 hours ago', type: 'event' as const },
    { id: '3', title: 'Water logging issue reported in Ward 02', timestamp: '5 hours ago', type: 'issue' as const },
    { id: '4', title: 'Door-to-door campaign completed in House 12', timestamp: '1 day ago', type: 'task' as const },
  ];

  const mockTasks = [
    { id: '1', title: 'Approve volunteer budget for Ward 01', status: 'pending' as const, dueDate: 'Today, 5:00 PM' },
    { id: '2', title: 'Review social media strategy draft', status: 'overdue' as const, dueDate: 'Yesterday' },
    { id: '3', title: 'Meet with union leaders', status: 'in_progress' as const, dueDate: 'Tomorrow, 10:00 AM' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('Campaign Overview')}</h2>
        <p className="text-muted-foreground mt-1">{t('High-level metrics and operational status.')}</p>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard 
          title={t('Total Wards')}
          value="12" 
          icon={MapPin} 
          colorClassName="bg-blue-500" 
          to="/organization"
        />
        <StatCard 
          title={t('Total Houses')}
          value="144" 
          icon={Home} 
          colorClassName="bg-indigo-500" 
          to="/organization"
        />
        <StatCard 
          title={t('Volunteers')}
          value="850" 
          icon={Users} 
          colorClassName="bg-emerald-500" 
          trend={{ value: 12, isPositive: true }}
          description={t('vs last month')}
          to="/organization"
        />
        <StatCard 
          title={t('Open Issues')}
          value="34" 
          icon={AlertTriangle} 
          colorClassName="bg-red-500" 
          trend={{ value: 5, isPositive: false }}
          description={t('Needs attention')}
          to="/issues"
        />
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard 
          title={t('Active Tasks')}
          value="128" 
          icon={CheckSquare} 
          colorClassName="bg-amber-500" 
          to="/tasks"
        />
        <StatCard 
          title={t('Upcoming Events')}
          value="15" 
          icon={Calendar} 
          colorClassName="bg-purple-500" 
          to="/tasks"
        />
        <StatCard 
          title={t('Pending Approvals')}
          value="7" 
          icon={Clock} 
          colorClassName="bg-orange-500" 
          to="/activity"
        />
        <StatCard 
          title={t('Voters Reached')}
          value="45.2k" 
          icon={Users} 
          colorClassName="bg-emerald-600" 
          trend={{ value: 2.4, isPositive: true }}
          description={t('This week')}
          to="/voters"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityFeed items={mockActivity} />
        </div>
        <div>
          <TaskListWidget tasks={mockTasks} />
        </div>
      </div>
    </div>
  );
}
