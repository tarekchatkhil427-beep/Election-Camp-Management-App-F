import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// --- Activity Feed Widget ---
interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'task' | 'issue' | 'voter' | 'event';
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 md:p-5 border-b border-border flex justify-between items-center bg-muted/30">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <Link to="/activity" className="text-xs font-medium text-primary hover:underline">View All</Link>
      </div>
      <div className="p-0 flex-1 overflow-y-auto">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="p-4 md:p-5 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                </div>
                <Badge type={item.type} />
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-8 text-center text-sm text-muted-foreground">No recent activity.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function Badge({ type }: { type: ActivityItem['type'] }) {
  const styles = {
    task: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    issue: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    voter: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    event: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  };
  
  return (
    <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-wider", styles[type])}>
      {type}
    </span>
  );
}

// --- Task List Widget ---
interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'overdue';
  dueDate: string;
}

export function TaskListWidget({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 md:p-5 border-b border-border flex justify-between items-center bg-muted/30">
        <h3 className="font-semibold text-foreground">Action Items</h3>
        <Link to="/tasks" className="text-xs font-medium text-primary hover:underline">Manage Tasks</Link>
      </div>
      <div className="p-0 flex-1 overflow-y-auto">
        <ul className="divide-y divide-border">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 md:p-5 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4 cursor-pointer">
              <div className="flex items-center gap-3 overflow-hidden">
                <StatusIcon status={task.status} />
                <div className="truncate">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {task.dueDate}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="p-8 text-center text-sm text-muted-foreground">No pending tasks.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: TaskItem['status'] }) {
  if (status === 'overdue') return <AlertCircle className="h-5 w-5 text-destructive shrink-0" />;
  if (status === 'in_progress') return <Clock className="h-5 w-5 text-amber-500 shrink-0" />;
  return <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0" />;
}
