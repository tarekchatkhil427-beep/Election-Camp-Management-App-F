import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageSquare, Calendar, Megaphone, AlertTriangle, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NotificationCategory = 'Tasks' | 'Messages' | 'Events' | 'Announcements' | 'Alerts';
type TimeGroup = 'Today' | 'Yesterday' | 'Earlier this week';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  timestamp: string;
  timeGroup: TimeGroup;
  read: boolean;
  link: string;
}

const initialNotifications: NotificationItem[] = [
  { id: 'n-1', title: 'New Task Assigned', description: 'You have been assigned to "Distribute Leaflets in Block A".', category: 'Tasks', timestamp: '10:42 AM', timeGroup: 'Today', read: false, link: '/tasks/my-tasks' },
  { id: 'n-2', title: 'URGENT: Rally Schedule Change', description: 'The rally on Saturday has been moved to 2 PM.', category: 'Announcements', timestamp: '9:15 AM', timeGroup: 'Today', read: false, link: '/messages' },
  { id: 'n-3', title: 'Message from Rahim Ahmed', description: '"Can you send the voter list?"', category: 'Messages', timestamp: '8:30 AM', timeGroup: 'Today', read: true, link: '/messages' },
  { id: 'n-4', title: 'Upcoming Event Reminder', description: 'Volunteer Training starts tomorrow at 10:00 AM.', category: 'Events', timestamp: '4:00 PM', timeGroup: 'Yesterday', read: false, link: '/events' },
  { id: 'n-5', title: 'Severe Weather Warning', description: 'Heavy rain expected during the outdoor campaign drive.', category: 'Alerts', timestamp: '2:15 PM', timeGroup: 'Yesterday', read: true, link: '/' },
  { id: 'n-6', title: 'Task Completed', description: 'Alif Hossain marked "Setup stage for townhall" as complete.', category: 'Tasks', timestamp: '11:00 AM', timeGroup: 'Earlier this week', read: true, link: '/tasks' },
  { id: 'n-7', title: 'New Campaign Asset', description: 'Jane Director uploaded "clean_village_poster_v1.jpg".', category: 'Alerts', timestamp: '9:00 AM', timeGroup: 'Earlier this week', read: true, link: '/social/campaigns' },
];

const CategoryIcon = ({ category, className }: { category: NotificationCategory; className?: string }) => {
  switch (category) {
    case 'Tasks': return <CheckCircle2 className={cn("text-emerald-500", className)} />;
    case 'Messages': return <MessageSquare className={cn("text-blue-500", className)} />;
    case 'Events': return <Calendar className={cn("text-purple-500", className)} />;
    case 'Announcements': return <Megaphone className={cn("text-orange-500", className)} />;
    case 'Alerts': return <AlertTriangle className={cn("text-red-500", className)} />;
    default: return null;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const navigate = useNavigate();

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNavigate = (link: string, id: string) => {
    // Optimistically mark as read on click
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    navigate(link);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationGroup = (group: TimeGroup, filteredNotifs: NotificationItem[]) => {
    const groupNotifs = filteredNotifs.filter(n => n.timeGroup === group);
    if (groupNotifs.length === 0) return null;

    return (
      <div key={group} className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">{group}</h3>
        <div className="flex flex-col gap-2">
          {groupNotifs.map(n => (
            <div 
              key={n.id}
              onClick={() => handleNavigate(n.link, n.id)}
              className={cn(
                "group relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                n.read 
                  ? "bg-card border-border/50 hover:bg-muted/30" 
                  : "bg-primary/5 border-primary/20 shadow-sm hover:bg-primary/10"
              )}
            >
              {!n.read && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1.5 h-3 w-3 bg-primary rounded-full border-2 border-background" />
              )}
              
              <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", n.read ? "bg-muted" : "bg-background shadow-sm")}>
                <CategoryIcon category={n.category} className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className={cn("text-sm truncate pr-4 font-semibold", n.read ? "text-foreground/80" : "text-foreground")}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.timestamp}</span>
                </div>
                <p className={cn("text-sm line-clamp-2", n.read ? "text-muted-foreground" : "text-foreground/90 font-medium")}>
                  {n.description}
                </p>
                
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1.5" onClick={(e) => markAsRead(n.id, e)}>
                      <Check className="h-3.5 w-3.5" /> Mark read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1.5 text-muted-foreground hover:text-destructive" onClick={(e) => deleteNotification(n.id, e)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeed = (categoryFilter?: NotificationCategory) => {
    let filtered = notifications;
    if (categoryFilter) {
      filtered = notifications.filter(n => n.category === categoryFilter);
    }

    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card border border-border border-dashed rounded-xl">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="font-medium">You're all caught up!</p>
          <p className="text-sm">No new notifications in this category.</p>
        </div>
      );
    }

    return (
      <div className="pb-8">
        {renderNotificationGroup('Today', filtered)}
        {renderNotificationGroup('Yesterday', filtered)}
        {renderNotificationGroup('Earlier this week', filtered)}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <Badge variant="default" className="text-xs px-2 rounded-full">{unreadCount} New</Badge>}
          </h1>
        </div>
        <Button variant="outline" className="gap-2" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <TabsList className="bg-transparent h-10 p-0 border-b border-border w-full justify-start rounded-none">
            <TabsTrigger value="All" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4">All</TabsTrigger>
            <TabsTrigger value="Tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4">Tasks</TabsTrigger>
            <TabsTrigger value="Messages" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4">Messages</TabsTrigger>
            <TabsTrigger value="Events" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4">Events</TabsTrigger>
            <TabsTrigger value="Announcements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4">Announcements</TabsTrigger>
            <TabsTrigger value="Alerts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4">Alerts</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="All" className="mt-0">{renderFeed()}</TabsContent>
          <TabsContent value="Tasks" className="mt-0">{renderFeed('Tasks')}</TabsContent>
          <TabsContent value="Messages" className="mt-0">{renderFeed('Messages')}</TabsContent>
          <TabsContent value="Events" className="mt-0">{renderFeed('Events')}</TabsContent>
          <TabsContent value="Announcements" className="mt-0">{renderFeed('Announcements')}</TabsContent>
          <TabsContent value="Alerts" className="mt-0">{renderFeed('Alerts')}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
