import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, KeyRound, ShieldOff, ShieldAlert, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCampaignStore, User } from '@/store/campaignStore';
import { toast } from 'sonner';

export default function UserManagement() {
  const { users, updateUserStatus, deleteUser, updateUser } = useCampaignStore();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users by name or email..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <AddUserModal />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-4 py-3">Name & Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Assigned Area</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">{user.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.scope}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>Edit Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ResetPasswordModalTrigger user={user} />
                        <DropdownMenuItem 
                          className={user.status === 'Active' ? "text-warning" : "text-success"}
                          onClick={() => {
                            updateUserStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active');
                            toast.success(`User ${user.status === 'Active' ? 'deactivated' : 'activated'}.`);
                          }}
                        >
                          <ShieldAlert className="h-4 w-4 mr-2" /> 
                          {user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10"
                          onClick={() => {
                            if (confirm(`Delete user ${user.name}?`)) {
                              deleteUser(user.id);
                              toast.success("User deleted.");
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSave={(updates) => {
            updateUser(editingUser.id, updates);
            toast.success("User updated.");
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

function AddUserModal() {
  const { addUser } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Volunteer',
    scope: 'General',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required.");
      return;
    }
    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      scope: formData.scope
    });
    toast.success("User added successfully.");
    setOpen(false);
    setFormData({ name: '', email: '', role: 'Volunteer', scope: 'General' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Tariq Rahman" />
          </div>
          <div className="space-y-2">
            <Label>Email Address *</Label>
            <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. user@campaign.org" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="Volunteer">Volunteer</option>
                <option value="House Coordinator">House Coordinator</option>
                <option value="Ward Coordinator">Ward Coordinator</option>
                <option value="Campaign Director">Campaign Director</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Assigned Scope</Label>
              <Input value={formData.scope} onChange={e => setFormData({ ...formData, scope: e.target.value })} placeholder="e.g. Ward 01" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Create Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordModalTrigger({ user }: { user: User }) {
  const { updateUser } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password || '');

  const handleSave = () => {
    if (!email) {
      toast.error("Email cannot be empty.");
      return;
    }
    updateUser(user.id, { email, password });
    toast.success("Credentials updated successfully.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <KeyRound className="h-4 w-4 mr-2" /> Reset Credentials
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Credentials</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">Update login credentials for <strong>{user.name}</strong>.</p>
          <div className="space-y-2">
            <Label>Email (Login ID)</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input 
              type="text" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter new password"
            />
            <p className="text-xs text-muted-foreground">Provide this password to the user.</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" className="gap-2" onClick={handleSave}>
            <KeyRound className="h-4 w-4" /> Save Credentials
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserModal({ user, onClose, onSave }: { user: User, onClose: () => void, onSave: (updates: Partial<User>) => void }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile || '',
    role: user.role,
    scope: user.scope,
    password: user.password || '',
  });

  return (
    <Dialog open={true} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Leave blank to keep unchanged" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Ward Coordinator</option>
                <option>House Coordinator</option>
                <option>Volunteer</option>
                <option>Candidate</option>
                <option>Campaign Director</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Assigned Scope</Label>
              <Input value={formData.scope} onChange={e => setFormData({ ...formData, scope: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={() => {
            if (!formData.name || !formData.email) {
              toast.error("Name and Email are required.");
              return;
            }
            onSave(formData);
          }}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
