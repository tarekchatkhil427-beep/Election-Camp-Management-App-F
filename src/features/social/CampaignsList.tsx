import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCampaignStore } from '@/store/campaignStore';

export default function CampaignsList() {
  const navigate = useNavigate();
  const { campaigns, addCampaign } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '' });

  const handleAdd = () => {
    if (!formData.name) {
      toast.error('Campaign name is required');
      return;
    }
    addCampaign({
      name: formData.name,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date().toISOString().split('T')[0],
      status: 'Planned',
      budget: '0',
      spent: '0',
    });
    toast.success('Campaign added successfully');
    setOpen(false);
    setFormData({ name: '', startDate: '', endDate: '' });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Active Campaigns</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Campaign</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Winter Clothing Drive" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleAdd}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {campaigns.map(campaign => (
          <div 
            key={campaign.id}
            onClick={() => navigate(`/social/campaigns/${campaign.id}`)}
            className="group bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer p-5 flex flex-col"
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                <Folder className="h-5 w-5" />
              </div>
              <Badge variant={campaign.status === 'Active' ? 'success' : campaign.status === 'Completed' ? 'secondary' : 'warning'}>
                {campaign.status}
              </Badge>
            </div>
            
            <h3 className="font-semibold text-lg text-foreground mb-1 leading-tight">{campaign.name}</h3>
            
            <div className="pt-4 mt-auto border-t border-border/50 flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{campaign.startDate} to {campaign.endDate}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-medium text-foreground"><Activity className="h-3.5 w-3.5 text-muted-foreground" /> {0} Posts</span>
                <span className="flex items-center gap-1 font-medium text-foreground"><Folder className="h-3.5 w-3.5 text-muted-foreground" /> {0} Assets</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
