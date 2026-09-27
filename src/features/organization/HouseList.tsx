import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, ArrowLeft, MoreHorizontal, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCampaignStore } from '@/store/campaignStore';
import { toast } from 'sonner';

export default function HouseList() {
  const { wardId } = useParams();
  const navigate = useNavigate();
  const { houses, deleteHouse } = useCampaignStore();

  const wardHouses = houses.filter(h => h.wardId === wardId);

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <Button variant="link" className="pl-0 text-muted-foreground mb-4" onClick={() => navigate('/organization/settings')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Wards
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Houses in {wardId?.toUpperCase()}</h1>
          <p className="text-muted-foreground mt-1">Manage all houses and coordinators for this ward.</p>
        </div>
        <AddHouseModal wardId={wardId || ''} />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">House</th>
                <th className="px-6 py-4 font-semibold text-center hidden md:table-cell">Volunteers</th>
                <th className="px-6 py-4 font-semibold text-center hidden sm:table-cell">Voters</th>
                <th className="px-6 py-4 font-semibold text-center hidden lg:table-cell">Tasks</th>
                <th className="px-6 py-4 font-semibold text-center hidden xl:table-cell">Events</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {wardHouses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-48 text-center text-muted-foreground">
                    No Houses found for this Ward.
                  </td>
                </tr>
              ) : wardHouses.map((house) => (
                <tr key={house.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{house.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{house.coordinator || 'Unassigned'}</div>
                  </td>
                  <td className="px-6 py-4 text-center hidden md:table-cell">{house.volunteers}</td>
                  <td className="px-6 py-4 text-center hidden sm:table-cell">{house.voters}</td>
                  <td className="px-6 py-4 text-center hidden lg:table-cell">{house.tasks}</td>
                  <td className="px-6 py-4 text-center hidden xl:table-cell">{house.events}</td>
                  <td className="px-6 py-4">
                    <Badge variant={house.status === 'Active' ? 'success' : 'warning'}>{house.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/organization/houses/${house.id}`}>Manage</Link>
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

function AddHouseModal({ wardId }: { wardId?: string }) {
  const { addHouse } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    coordinator: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("House Name is required.");
      return;
    }
    addHouse({
      wardId: wardId || '',
      name: formData.name,
      coordinator: formData.coordinator || 'Unassigned',
      status: formData.status
    });
    toast.success(`${formData.name} created successfully.`);
    setOpen(false);
    setFormData({ name: '', coordinator: '', status: 'Active' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add House</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New House</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">House Name/Number *</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. House 07" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. H-07" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward">Ward</Label>
            <Input id="ward" defaultValue={wardId?.toUpperCase()} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordinator">Coordinator</Label>
            <Input id="coordinator" value={formData.coordinator} onChange={e => setFormData({ ...formData, coordinator: e.target.value })} placeholder="e.g. Rahim Ahmed" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location / Area</Label>
            <Input id="location" placeholder="e.g. Sector 4, Block B" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" placeholder="Brief notes..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Save House</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
