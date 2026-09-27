import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCampaignStore, Ward, House } from '@/store/campaignStore';
import { Copy, PhoneCall, UserCircle2, ChevronRight, Home, MapPin, Folder, Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VolunteerProfile } from '@/components/ui/VolunteerProfile';
import { VoterTable } from '@/components/voters/VoterTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface OrgFolderExplorerProps {
  mode?: 'admin' | 'view';
}




function CompactVolunteerCard({ volunteer, onEdit, onDelete }: any) {
  const [open, setOpen] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(volunteer.phone);
    toast.success('Phone copied!');
  };

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center p-2 sm:p-4 border border-border rounded-xl bg-card hover:bg-muted/50 cursor-pointer transition-all text-center gap-1 shadow-sm"
      >
        <UserCircle2 className="h-8 w-8 sm:h-12 sm:w-12 text-primary/80 mb-1" />
        <span className="font-semibold text-[10px] sm:text-sm truncate w-full">{volunteer.name}</span>
        <span className="text-[8px] sm:text-xs text-muted-foreground truncate w-full">{volunteer.role}</span>
        <div className="mt-1" onClick={handleCopy}>
           <Badge variant="outline" className="text-[9px] py-0 px-1 bg-primary/5 hover:bg-primary/10 border-primary/20 cursor-pointer">
             <PhoneCall className="h-2 w-2 mr-1" /> Call
           </Badge>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Volunteer Details</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <UserCircle2 className="h-20 w-20 text-muted-foreground" />
            <div className="text-center">
              <h2 className="text-2xl font-bold">{volunteer.name}</h2>
              <p className="text-primary font-medium">{volunteer.role}</p>
            </div>
            
            <div className="w-full space-y-3 mt-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-full shadow-sm"><PhoneCall className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="font-medium text-sm">{volunteer.phone}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-3 w-3 mr-2" /> Copy
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-full shadow-sm"><MapPin className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-medium text-sm">{volunteer.status}</p>
                  </div>
                </div>
                <Badge variant={volunteer.status === 'Active' ? 'success' : 'secondary'}>{volunteer.status}</Badge>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            {onEdit && <Button variant="outline" onClick={() => { setOpen(false); onEdit(); }}><Edit className="h-4 w-4 mr-2"/> Edit</Button>}
            {onDelete && <Button variant="destructive" onClick={() => { setOpen(false); onDelete(); }}><Trash2 className="h-4 w-4 mr-2"/> Delete</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function OrgFolderExplorer({ mode = 'admin' }: OrgFolderExplorerProps) {
  const { t } = useTranslation();
  const { wards, houses, volunteers, voters, deleteWard, deleteHouse } = useCampaignStore();
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  const [editingWard, setEditingWard] = useState<Ward | null>(null);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [editingVolunteer, setEditingVolunteer] = useState<any | null>(null);

  const activeWard = wards.find(w => w.id === selectedWard);
  const activeHouse = houses.find(h => h.id === selectedHouse);

  const wardHouses = houses.filter(h => h.wardId === selectedWard);
  const houseVolunteers = volunteers.filter(v => v.houseId === selectedHouse);

  const resetWard = () => {
    setSelectedWard(null);
    setSelectedHouse(null);
  };

  const resetHouse = () => {
    setSelectedHouse(null);
  };

  const handleBack = () => {
    if (selectedHouse) {
      setSelectedHouse(null);
    } else if (selectedWard) {
      setSelectedWard(null);
    }
  };

  const handleDeleteWard = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteWard(id);
      toast.success(`${name} deleted`);
    }
  };

  const handleDeleteHouse = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteHouse(id);
      toast.success(`${name} deleted`);
    }
  };

  const { deleteVolunteer } = useCampaignStore();
  const handleDeleteVolunteer = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteVolunteer(id);
      toast.success(`${name} deleted`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Admin Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          { (selectedWard || selectedHouse) && (
            <Button variant="outline" size="sm" onClick={handleBack} className="mr-2 h-8">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <button onClick={resetWard} className={`hover:text-foreground transition-colors ${!selectedWard ? 'text-foreground' : ''}`}>
            {t('All Wards') || 'All Wards'}
          </button>
          {activeWard && (
            <>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <button onClick={resetHouse} className={`hover:text-foreground transition-colors ${selectedWard && !selectedHouse ? 'text-foreground' : ''}`}>
                {activeWard.name}
              </button>
            </>
          )}
          {activeHouse && (
            <>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="text-foreground">{activeHouse.name}</span>
            </>
          )}
        </div>
        
        {mode === 'admin' && (
          <div className="flex items-center gap-2">
            {selectedWard && !selectedHouse && <AddHouseModal wardId={selectedWard} />}
            {selectedWard && selectedHouse && <AddVolunteerModal wardId={selectedWard} houseId={selectedHouse} />}
          </div>
        )}
      </div>

      {/* Level 1: Wards */}
      {!selectedWard && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
          {wards.map((ward) => (
            <div 
              key={ward.id}
              onClick={() => setSelectedWard(ward.id)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border shadow-sm hover:shadow-md hover:bg-card/90 transition-all duration-200 border-l-4 border-l-blue-500 p-2 sm:p-4 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 sm:h-10 sm:w-10 rounded-full shrink-0 bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[11px] sm:text-lg text-foreground group-hover:text-blue-600 transition-colors">{ward.name}</h3>
                    <p className="text-[10px] sm:text-sm text-muted-foreground font-medium truncate">{ward.coordinator || t('Unassigned') || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={ward.status === 'Active' ? 'success' : 'warning'}>{ward.status}</Badge>
                  {mode === 'admin' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingWard(ward)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => handleDeleteWard(e, ward.id, ward.name)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('Houses') || 'Houses'}</div>
                  <div className="font-bold text-[11px] sm:text-lg">{houses.filter(h => h.wardId === ward.id).length}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('Vols') || 'Vols'}</div>
                  <div className="font-bold text-[11px] sm:text-lg">{volunteers.filter(v => v.wardId === ward.id).length}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('Voters') || 'Voters'}</div>
                  <div className="font-bold text-[11px] sm:text-lg">{voters.filter(v => v.wardId === ward.id).length}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level 2: Houses */}
      {selectedWard && !selectedHouse && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
          {wardHouses.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p>{t('No houses found in this ward.') || 'No houses found in this ward.'}</p>
            </div>
          ) : (
            wardHouses.map((house) => (
              <div 
                key={house.id}
                onClick={() => setSelectedHouse(house.id)}
                className="group cursor-pointer relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md border border-border shadow-sm hover:shadow-md hover:bg-card/90 transition-all duration-200 border-l-4 border-l-indigo-500 p-2 sm:p-4 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 sm:h-10 sm:w-10 rounded-full shrink-0 bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                      <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[11px] sm:text-lg text-foreground group-hover:text-indigo-600 transition-colors">{house.name}</h3>
                      <p className="text-[10px] sm:text-sm text-muted-foreground font-medium truncate">{house.coordinator || t('Unassigned') || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={house.status === 'Active' ? 'success' : 'warning'}>{house.status}</Badge>
                    {mode === 'admin' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingHouse(house)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => handleDeleteHouse(e, house.id, house.name)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{t('Volunteers') || 'Volunteers'}</div>
                    <div className="font-bold text-[11px] sm:text-lg">{volunteers.filter(v => v.houseId === house.id).length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{t('Voters') || 'Voters'}</div>
                    <div className="font-bold text-[11px] sm:text-lg">{voters.filter(v => v.houseId === house.id).length}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Level 3: Volunteers and Voters */}
      {selectedWard && selectedHouse && activeHouse && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col bg-card/60 backdrop-blur-md border border-border rounded-2xl shadow-sm overflow-hidden border-t-4 border-t-emerald-500 min-h-[500px]">
            <div className="p-4 border-b border-border bg-muted/30 font-semibold flex justify-between items-center">
              <span>{t('Volunteers in ') || 'Volunteers in '}{activeHouse.name}</span>
              <Badge variant="secondary">{houseVolunteers.length} Active</Badge>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[600px]">
              {houseVolunteers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">{t('No volunteers found.') || 'No volunteers found.'}</div>
              ) : houseVolunteers.map(vol => (
                <VolunteerProfile 
                  key={vol.id} 
                  volunteer={vol} 
                  onEdit={mode === 'admin' ? () => setEditingVolunteer(vol) : undefined}
                  onDelete={mode === 'admin' ? () => handleDeleteVolunteer(vol.id, vol.name) : undefined}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col bg-card/60 backdrop-blur-md border border-border rounded-2xl shadow-sm overflow-hidden border-t-4 border-t-purple-500 min-h-[500px]">
            <div className="p-4 border-b border-border bg-muted/30 font-semibold flex justify-between items-center">
              <span>Voters Database — {activeHouse.name}</span>
              <AddVoterModal wardId={activeHouse.wardId} houseId={activeHouse.id} />
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-[600px]">
              <VoterTable houseId={activeHouse.id} />
            </div>
          </div>
        </div>
      )}
      
      {editingWard && <EditWardModal ward={editingWard} onClose={() => setEditingWard(null)} />}
      {editingHouse && <EditHouseModal house={editingHouse} onClose={() => setEditingHouse(null)} />}
      {editingVolunteer && <EditVolunteerModal volunteer={editingVolunteer} onClose={() => setEditingVolunteer(null)} />}
    </div>
  );
}

function AddVoterModal({ wardId, houseId }: { wardId: string; houseId: string }) {
  const { t } = useTranslation();
  const { addVoter } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    gender: 'Male',
    age: '',
    party: 'Neutral',
    status: 'Approved' as any,
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.mobile) {
      toast.error("Name and mobile are required.");
      return;
    }
    
    addVoter({
      wardId,
      houseId,
      name: formData.name,
      mobile: formData.mobile,
      gender: formData.gender,
      age: parseInt(formData.age) || 30,
      party: formData.party,
      status: formData.status,
      contactVolunteer: t('Unassigned') || 'Unassigned',
    });
    
    toast.success(`${formData.name} added to Voter Database.`);
    setOpen(false);
    setFormData({ name: '', mobile: '', gender: 'Male', age: '', party: 'Neutral', status: 'Approved' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-background">
          <Plus className="h-3 w-3" /> {t('Add Voter') || 'Add Voter'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Voter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Rahim Uddin" />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number *</Label>
            <Input value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="01XXX-XXXXXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Party Affiliation</Label>
              <select value={formData.party} onChange={e => setFormData({ ...formData, party: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Support</option>
                <option>Neutral</option>
                <option>Oppose</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Save Voter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddHouseModal({ wardId }: { wardId: string }) {
  const { t } = useTranslation();
  const { addHouse, addUser, wards } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    coordinatorName: '',
    coordinatorMobile: '',
    coordinatorEmail: '',
    coordinatorPassword: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("House Name is required.");
      return;
    }
    
    addHouse({
      wardId,
      name: formData.name,
      coordinator: formData.coordinatorName || t('Unassigned') || 'Unassigned',
      status: formData.status,
    });

    if (formData.coordinatorName && formData.coordinatorEmail && formData.coordinatorPassword) {
      const parentWard = wards.find(w => w.id === wardId);
      addUser({
        name: formData.coordinatorName,
        role: 'House Coordinator',
        scope: `${parentWard?.name || ''} - ${formData.name}`,
        email: formData.coordinatorEmail,
        mobile: formData.coordinatorMobile,
        password: formData.coordinatorPassword,
      });
      toast.success(`House & Coordinator created successfully.`);
    } else {
      toast.success(`${formData.name} created successfully.`);
    }
    
    setOpen(false);
    setFormData({ name: '', coordinatorName: '', coordinatorMobile: '', coordinatorEmail: '', coordinatorPassword: '', status: 'Active' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2 h-8 text-xs">
          <Plus className="h-3 w-3" /> {t('Add House') || 'Add House'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New House</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>House Number/Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. House 01" />
          </div>
          
          <div className="border-t border-border pt-4 mt-2">
            <h4 className="text-sm font-semibold mb-3">Assign House Coordinator (Optional)</h4>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.coordinatorName} onChange={e => setFormData({ ...formData, coordinatorName: e.target.value })} placeholder="e.g. Rahim" />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input value={formData.coordinatorMobile} onChange={e => setFormData({ ...formData, coordinatorMobile: e.target.value })} placeholder="01XXX-XXXXXX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email (Login ID)</Label>
                  <Input type="email" value={formData.coordinatorEmail} onChange={e => setFormData({ ...formData, coordinatorEmail: e.target.value })} placeholder="rahim@campaign.com" />
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
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Pending / Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Create House</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddVolunteerModal({ wardId, houseId }: { wardId: string, houseId: string }) {
  const { addVolunteer, addUser, wards, houses } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Door-to-door',
    phone: '',
    email: '',
    password: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Volunteer Name is required.");
      return;
    }
    
    addVolunteer({
      wardId,
      houseId,
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      status: formData.status,
    });

    if (formData.email && formData.password) {
      const parentWard = wards.find(w => w.id === wardId);
      const parentHouse = houses.find(h => h.id === houseId);
      addUser({
        name: formData.name,
        role: 'Volunteer',
        scope: `${parentWard?.name || ''} - ${parentHouse?.name || ''}`,
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
      });
      toast.success(`Volunteer created with login access.`);
    } else {
      toast.success(`${formData.name} added successfully.`);
    }
    
    setOpen(false);
    setFormData({ name: '', role: 'Door-to-door', phone: '', email: '', password: '', status: 'Active' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2 h-8 text-xs">
          <Plus className="h-3 w-3" /> Add Volunteer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Volunteer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Volunteer Name *</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Hasan" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Door-to-door" />
            </div>
          </div>
          
          <div className="border-t border-border pt-4 mt-2">
            <h4 className="text-sm font-semibold mb-3">Provide Login Access (Optional)</h4>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="01XXX-XXXXXX" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email (Login ID)</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="hasan@campaign.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Add Volunteer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditWardModal({ ward, onClose }: { ward: Ward, onClose: () => void }) {
  const { updateWard } = useCampaignStore();
  const [formData, setFormData] = useState({
    name: ward.name,
    coordinator: ward.coordinator,
    status: ward.status,
  });

  const handleSubmit = () => {
    updateWard(ward.id, formData);
    toast.success(`${formData.name} updated`);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Ward</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Ward Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Coordinator</Label>
            <Input value={formData.coordinator} onChange={e => setFormData({ ...formData, coordinator: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditHouseModal({ house, onClose }: { house: House, onClose: () => void }) {
  const { updateHouse } = useCampaignStore();
  const [formData, setFormData] = useState({
    name: house.name,
    coordinator: house.coordinator,
    status: house.status,
  });

  const handleSubmit = () => {
    updateHouse(house.id, formData);
    toast.success(`${formData.name} updated`);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit House</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>House Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Coordinator</Label>
            <Input value={formData.coordinator} onChange={e => setFormData({ ...formData, coordinator: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditVolunteerModal({ volunteer, onClose }: { volunteer: any, onClose: () => void }) {
  const { updateVolunteer } = useCampaignStore();
  const [formData, setFormData] = useState({
    name: volunteer.name,
    role: volunteer.role,
    phone: volunteer.phone,
    status: volunteer.status,
  });

  const handleSubmit = () => {
    updateVolunteer(volunteer.id, formData);
    toast.success(`${formData.name} updated`);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Volunteer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Volunteer Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
