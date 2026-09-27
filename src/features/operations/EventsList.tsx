import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Clock, AlignLeft, Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOperationsStore, EventItem } from '@/store/operationsStore';
import { toast } from 'sonner';

export default function EventsList() {
  const { events, deleteEvent } = useOperationsStore();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete event "${name}"?`)) {
      deleteEvent(id);
      toast.success("Event deleted.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Events Schedule</h2>
        <AddEventModal />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-4 py-3">Event Name</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 hidden sm:table-cell">Organizer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-32 text-center text-muted-foreground">
                    No events scheduled.
                  </td>
                </tr>
              ) : events.map(event => (
                <tr key={event.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{event.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5"><CalendarIcon className="h-3 w-3" /> {event.date}</div>
                    <div className="flex items-center gap-1.5 mt-0.5"><Clock className="h-3 w-3" /> {event.time}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {event.ward} • {event.house}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">{event.organizer}</td>
                  <td className="px-4 py-3">
                    <Badge variant={event.status === 'Completed' ? 'secondary' : 'default'}>{event.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm">View</Button>
                      </SheetTrigger>
                      <EventDetailDrawer event={event} />
                    </Sheet>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2" onClick={() => handleDelete(event.id, event.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddEventModal() {
  const { addEvent } = useOperationsStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    ward: '',
    house: '',
    organizer: '',
    status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled'
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Event Name is required.");
      return;
    }
    addEvent({
      name: formData.name,
      date: formData.date || 'TBD',
      time: formData.time || 'TBD',
      ward: formData.ward || 'N/A',
      house: formData.house || 'N/A',
      organizer: formData.organizer || 'Unassigned',
      participants: 0,
      status: formData.status
    });
    toast.success("Event added successfully.");
    setOpen(false);
    setFormData({ name: '', date: '', time: '', ward: '', house: '', organizer: '', status: 'Scheduled' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Create Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Event Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Townhall Rally" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ward</Label>
              <Input value={formData.ward} onChange={e => setFormData({ ...formData, ward: e.target.value })} placeholder="e.g. Ward 01" />
            </div>
            <div className="space-y-2">
              <Label>House</Label>
              <Input value={formData.house} onChange={e => setFormData({ ...formData, house: e.target.value })} placeholder="e.g. House 07" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Organizer</Label>
            <Input value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} placeholder="e.g. Rahim Ahmed" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EventDetailDrawer({ event }: { event: EventItem }) {
  return (
    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
      <SheetHeader className="mb-6 border-b border-border pb-4">
        <SheetTitle className="text-2xl">{event.name}</SheetTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={event.status === 'Completed' ? 'secondary' : 'default'}>{event.status}</Badge>
          <span className="text-sm text-muted-foreground">{event.ward} • {event.house}</span>
        </div>
      </SheetHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Date & Time</p>
              <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{event.ward}, {event.house}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Participants</p>
              <p className="text-sm text-muted-foreground">{event.participants} expected</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlignLeft className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Organizer</p>
              <p className="text-sm text-muted-foreground">{event.organizer}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is a mock description for {event.name}. Here you would find details regarding the agenda, topics to cover, and specific notes for the organizer and participants.
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="font-semibold mb-2">Associated Tasks</h3>
          <div className="space-y-2">
            <div className="p-3 bg-muted/50 rounded border border-border text-sm flex justify-between items-center">
              <span>Setup AV equipment</span>
              <Badge variant="outline">Completed</Badge>
            </div>
            <div className="p-3 bg-muted/50 rounded border border-border text-sm flex justify-between items-center">
              <span>Distribute flyers</span>
              <Badge variant="warning">In Progress</Badge>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}
