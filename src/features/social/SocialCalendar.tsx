import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, subMonths, addMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCampaignStore } from '@/store/campaignStore';

export default function SocialCalendar() {
  const { socialPosts, addSocialPost, users } = useCampaignStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');
  
  // Modal State
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({ contentTitle: '', caption: '', assigneeId: '', status: 'Scheduled' });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleCellClick = (day: Date) => {
    setSelectedDate(day);
    setFormData({ contentTitle: '', caption: '', assigneeId: '', status: 'Scheduled' });
    setOpen(true);
  };

  const handleSavePost = () => {
    if (!formData.contentTitle || !formData.assigneeId) {
      toast.error('Title and Assignee are required.');
      return;
    }
    addSocialPost({
      date: format(selectedDate, 'yyyy-MM-dd'),
      contentTitle: formData.contentTitle,
      caption: formData.caption,
      assigneeId: formData.assigneeId,
      status: formData.status as any,
    });
    toast.success('Social post scheduled successfully');
    setOpen(false);
  };

  // Generate calendar days
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      const cloneDay = day;
      
      const dayPosts = socialPosts.filter(p => p.date === format(cloneDay, 'yyyy-MM-dd') && (selectedUserFilter === 'all' || p.assigneeId === selectedUserFilter));

      days.push(
        <div
          key={day.toString()}
          onClick={() => handleCellClick(cloneDay)}
          className={cn(
            "min-h-[120px] p-2 border border-border/50 transition-colors cursor-pointer hover:bg-muted/30 flex flex-col gap-1",
            !isSameMonth(day, monthStart) ? "bg-muted/10 text-muted-foreground/50" : "bg-card",
            isSameDay(day, new Date()) ? "ring-1 ring-primary/50" : ""
          )}
        >
          <div className="flex justify-between items-start">
            <span className={cn("text-sm font-medium", isSameDay(day, new Date()) ? "text-primary font-bold" : "")}>
              {formattedDate}
            </span>
            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100"><Plus className="h-3 w-3" /></Button>
          </div>
          <div className="flex-1 flex flex-col gap-1 overflow-y-auto mt-1 no-scrollbar">
            {dayPosts.map(post => {
              const user = users.find(u => u.id === post.assigneeId);
              return (
                <div key={post.id} className="text-xs bg-primary/10 border border-primary/20 p-1.5 rounded-md text-foreground flex flex-col gap-0.5" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <div className="font-semibold truncate">{post.contentTitle}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {user ? user.name : 'Unassigned'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary" /> Content Calendar</h2>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium px-2 min-w-[120px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Label className="text-sm text-muted-foreground">View as:</Label>
          <select 
            value={selectedUserFilter}
            onChange={e => setSelectedUserFilter(e.target.value)}
            className="flex h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">Everyone</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-muted/30 border-b border-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {rows}
        </div>
      </div>

      {/* Schedule Post Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Schedule Post for {format(selectedDate, 'MMM d, yyyy')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Content Title / Topic</Label>
              <Input 
                value={formData.contentTitle} 
                onChange={e => setFormData({ ...formData, contentTitle: e.target.value })} 
                placeholder="e.g. Infrastructure Updates" 
              />
            </div>
            <div className="space-y-2">
              <Label>Caption & Details</Label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.caption} 
                onChange={e => setFormData({ ...formData, caption: e.target.value })} 
                placeholder="Write the social media caption here..." 
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assign To User</Label>
                <select 
                  value={formData.assigneeId} 
                  onChange={e => setFormData({ ...formData, assigneeId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select Assignee</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSavePost}>Schedule Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
