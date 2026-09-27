import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCampaignStore } from '@/store/campaignStore';
import { toast } from 'sonner';
import UserManagement from '@/features/settings/UserManagement';
import { OrgFolderExplorer } from '@/features/organization/OrgFolderExplorer';
import { Plus } from 'lucide-react';

export default function OrganizationSettings() {
  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Organization Settings</h1>
          <p className="text-muted-foreground mt-1">Manage wards, houses, users, and hierarchy.</p>
        </div>
        <AddWardModal />
      </div>

      <Tabs defaultValue="wards" className="w-full">
        <TabsList className="mb-6 bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger value="wards" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">Wards & Houses</TabsTrigger>
          <TabsTrigger value="users" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="wards">
          <OrgFolderExplorer />
        </TabsContent>
        <TabsContent value="users" className="pt-2">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddWardModal({ variant = "default" }: { variant?: "default" | "outline" }) {
  const { addWard, addUser } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    coordinatorName: '',
    coordinatorMobile: '',
    coordinatorEmail: '',
    coordinatorPassword: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Ward Name is required.");
      return;
    }
    
    addWard({
      name: formData.name,
      code: formData.code,
      coordinator: formData.coordinatorName || 'Unassigned',
      status: formData.status
    });

    if (formData.coordinatorName && formData.coordinatorEmail && formData.coordinatorPassword) {
      addUser({
        name: formData.coordinatorName,
        role: 'Ward Coordinator',
        scope: formData.name,
        email: formData.coordinatorEmail,
        mobile: formData.coordinatorMobile,
        password: formData.coordinatorPassword,
      });
      toast.success(`Ward & Coordinator created successfully.`);
    } else {
      toast.success(`${formData.name} created successfully.`);
    }

    setOpen(false);
    setFormData({ name: '', code: '', coordinatorName: '', coordinatorMobile: '', coordinatorEmail: '', coordinatorPassword: '', status: 'Active' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="gap-2"><Plus className="h-4 w-4" /> Add Ward</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Ward</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ward Name/Number *</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Ward 01" />
            </div>
            <div className="space-y-2">
              <Label>Ward Code</Label>
              <Input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. W-01" />
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mt-2">
            <h4 className="text-sm font-semibold mb-3">Assign Ward Coordinator (Optional)</h4>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.coordinatorName} onChange={e => setFormData({ ...formData, coordinatorName: e.target.value })} placeholder="e.g. Abdul Karim" />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input value={formData.coordinatorMobile} onChange={e => setFormData({ ...formData, coordinatorMobile: e.target.value })} placeholder="01XXX-XXXXXX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email (Login ID)</Label>
                  <Input type="email" value={formData.coordinatorEmail} onChange={e => setFormData({ ...formData, coordinatorEmail: e.target.value })} placeholder="karim@campaign.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={formData.coordinatorPassword} onChange={e => setFormData({ ...formData, coordinatorPassword: e.target.value })} placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Pending / Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Create Ward</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

