import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Download } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VolunteerProfile } from '@/components/ui/VolunteerProfile';
import { VoterTable } from '@/components/voters/VoterTable';
import { useCampaignStore } from '@/store/campaignStore';
import { toast } from 'sonner';

export default function HouseDetail() {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const { houses, volunteers } = useCampaignStore();

  const house = houses.find(h => h.id === houseId) || houses[0];
  const houseVolunteers = volunteers.filter(v => v.houseId === houseId);

  return (
    <div className="max-w-[1600px] mx-auto pb-8 flex flex-col h-full">
      <Button variant="link" className="pl-0 text-muted-foreground mb-4 self-start" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{house?.name || `House ${houseId}`}</h1>
          <p className="text-muted-foreground mt-1">Coordinator: {house?.coordinator || 'Unassigned'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
          <AddVolunteerModal houseId={houseId || ''} wardId={house?.wardId || ''} />
        </div>
      </div>

      {/* Mobile: Tabs View | Desktop: Side-by-Side Split View */}
      <div className="flex-1 mt-4">
        {/* Desktop Split View (hidden on lg and down, block on xl and up) */}
        <div className="hidden xl:grid grid-cols-2 gap-8 h-full min-h-[600px]">
          {/* Volunteers Panel */}
          <div className="flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 font-semibold flex justify-between items-center">
              Volunteers ({houseVolunteers.length})
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {houseVolunteers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No volunteers assigned to this house.</div>
              ) : houseVolunteers.map(vol => (
                <VolunteerProfile key={vol.id} volunteer={vol} />
              ))}
            </div>
          </div>
          
          {/* Voters Panel */}
          <div className="flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 font-semibold">
              Voter Database
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <VoterTable />
            </div>
          </div>
        </div>

        {/* Mobile Tabs View (visible on lg and down, hidden on xl and up) */}
        <div className="xl:hidden">
          <Tabs defaultValue="volunteers" className="w-full">
            <TabsList className="mb-6 w-full grid grid-cols-2">
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              <TabsTrigger value="voters">Voters Database</TabsTrigger>
            </TabsList>
            
            <TabsContent value="volunteers" className="mt-0">
              <div className="space-y-4">
                {houseVolunteers.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No volunteers assigned to this house.</div>
                ) : houseVolunteers.map(vol => (
                  <VolunteerProfile key={vol.id} volunteer={vol} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="voters" className="mt-0">
              <div className="bg-card border border-border rounded-xl shadow-sm p-4">
                <VoterTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function AddVolunteerModal({ houseId, wardId }: { houseId: string; wardId: string }) {
  const { addVolunteer } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'Door-to-door Agent',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Name is required.");
      return;
    }
    addVolunteer({
      wardId,
      houseId,
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
    });
    toast.success(`${formData.name} added as volunteer.`);
    setOpen(false);
    setFormData({ name: '', phone: '', role: 'Door-to-door Agent', status: 'Active' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Volunteer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Volunteer</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Alif Hossain" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="01XXX-XXXXXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="Door-to-door Agent">Door-to-door Agent</option>
              <option value="Data Entry">Data Entry</option>
              <option value="Event Staff">Event Staff</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward">Ward</Label>
            <Input id="ward" defaultValue={wardId} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="house">House</Label>
            <Input id="house" defaultValue={houseId} disabled />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="availability">Availability</Label>
            <Input id="availability" placeholder="e.g. Weekends, Evenings" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="skills">Skills</Label>
            <Input id="skills" placeholder="e.g. Communication, Tech-savvy" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Additional information..." />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Save Volunteer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
