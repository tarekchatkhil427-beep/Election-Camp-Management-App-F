import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, FileText, MoreHorizontal, X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useCampaignStore, Voter } from '@/store/campaignStore';
import { EditVoterModal } from '@/components/voters/VoterTable';

// Creating a wrapper component to use hooks inside columns if needed, or pass t from the main component
// A common pattern is to pass `t` via the `meta` prop to columns, or we can just translate the headers dynamically.

export default function VoterDatabase() {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { voters, wards, houses, updateVoter, deleteVoter } = useCampaignStore();
  const [editingVoter, setEditingVoter] = useState<any>(null);

  const [wardFilter, setWardFilter] = useState('');
  const [houseFilter, setHouseFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [partyFilter, setPartyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const columns: ColumnDef<Voter, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('Name')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium whitespace-nowrap">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "wardName",
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('Ward')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      meta: { className: "hidden md:table-cell" }
    },
    {
      accessorKey: "houseName",
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('House')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      meta: { className: "hidden md:table-cell" }
    },
    {
      accessorKey: "age",
      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('Age')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      meta: { className: "hidden lg:table-cell" }
    },
    {
      accessorKey: "gender",
      header: t('Gender') || "Gender",
      meta: { className: "hidden lg:table-cell" }
    },
    {
      accessorKey: "party",
      header: t('Party') || "Party",
      meta: { className: "hidden md:table-cell" }
    },
    {
      accessorKey: "mobile",
      header: t('Mobile') || "Mobile",
    },
    {
      accessorKey: "contactVolunteer",
      header: t('Contact Volunteer') || "Contact Volunteer",
      meta: { className: "hidden lg:table-cell" }
    },
    {
      accessorKey: "status",
      header: t('Status') || "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === "Approved" ? "success" : status === "Pending" ? "warning" : "destructive"}>{t(status) || status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const voter = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(voter.mobile)}>
                {t('Copy mobile number') || 'Copy mobile number'}
              </DropdownMenuItem>
              {voter.status !== 'Approved' && (
                <DropdownMenuItem onClick={() => (table.options.meta as any)?.onStatusChange(voter.id, 'Approved')}>
                  {t('Approve Voter') || 'Approve Voter'}
                </DropdownMenuItem>
              )}
              {voter.status !== 'Rejected' && (
                <DropdownMenuItem onClick={() => (table.options.meta as any)?.onStatusChange(voter.id, 'Rejected')}>
                  {t('Reject Voter') || 'Reject Voter'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => (table.options.meta as any)?.onEdit(voter)}>
                {t('Edit record') || 'Edit record'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => (table.options.meta as any)?.onDelete(voter)}>
                {t('Delete record') || 'Delete record'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const enrichedVoters = voters.map(v => ({
    ...v,
    wardName: wards.find(w => w.id === v.wardId)?.name || 'Unknown',
    houseName: houses.find(h => h.id === v.houseId)?.name || 'Unknown',
  }));

  const filteredVoters = enrichedVoters.filter(v => {
    if (wardFilter && v.wardId !== wardFilter) return false;
    if (houseFilter && v.houseId !== houseFilter) return false;
    if (genderFilter && v.gender.toLowerCase() !== genderFilter.toLowerCase()) return false;
    if (partyFilter && v.party.toLowerCase() !== partyFilter.toLowerCase()) return false;
    if (statusFilter && v.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  const hasActiveFilters = Boolean(wardFilter || houseFilter || genderFilter || partyFilter || statusFilter);

  const handleResetFilters = () => {
    setWardFilter('');
    setHouseFilter('');
    setGenderFilter('');
    setPartyFilter('');
    setStatusFilter('');
  };

  const exportRecordCount = Object.keys(selectedRows).length > 0 
    ? Object.keys(selectedRows).length 
    : filteredVoters.length;

  return (
    <div className="max-w-[1600px] mx-auto pb-8 flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('Voter Database')}</h1>
          <p className="text-muted-foreground mt-1">{t('Campaign-wide voter records and assignments.') || 'Campaign-wide voter records and assignments.'}</p>
        </div>
        <AddVoterGlobalModal />
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6">
        <DataTable 
          columns={columns} 
          data={filteredVoters} 
          placeholder={t("Search by name or mobile...") || "Search by name or mobile..."}
          onSelectionChange={setSelectedRows}
          meta={{
            onEdit: setEditingVoter,
            onDelete: (voter: any) => {
              if (confirm(`${t('Are you sure you want to delete')} ${voter.name}?`)) {
                deleteVoter(voter.id);
                toast.success(`${voter.name} ${t('deleted') || 'deleted'}`);
              }
            },
            onStatusChange: (id: string, status: string) => {
              updateVoter(id, { status: status as any });
              toast.success(`${t('Voter status updated to')} ${t(status) || status}`);
            }
          }}
          toolbarFilters={
              <div className="flex flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="grid grid-cols-3 gap-2 w-full">
                  <select value={wardFilter} onChange={e => { setWardFilter(e.target.value); setHouseFilter(''); }} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Ward</option>
                    {wards.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  <select value={houseFilter} onChange={e => setHouseFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">House</option>
                    {houses.filter(h => !wardFilter || h.wardId === wardFilter).map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                  <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full">
                  <select value={partyFilter} onChange={e => setPartyFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Party</option>
                    <option value="support">Support</option>
                    <option value="neutral">Neutral</option>
                    <option value="oppose">Oppose</option>
                  </select>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3 mr-1" /> Reset
                    </Button>
                  )}
                </div>
              </div>
            }
            toolbarActions={
            <ExportModal recordCount={exportRecordCount} />
          }
        />
      </div>
      {editingVoter && (
        <EditVoterModal 
          voter={editingVoter} 
          onClose={() => setEditingVoter(null)}
          onSave={(id, updates) => {
            updateVoter(id, updates);
            toast.success("Voter updated");
            setEditingVoter(null);
          }}
        />
      )}
    </div>
  );
}

function ExportModal({ recordCount }: { recordCount: number }) {
  const [format, setFormat] = useState('csv');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Export Records</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Selected for Export</p>
              <p className="text-xs text-muted-foreground">{recordCount} records</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                type="button"
                variant={format === 'csv' ? 'default' : 'outline'} 
                onClick={() => setFormat('csv')}
                className="w-full"
              >
                CSV
              </Button>
              <Button 
                type="button"
                variant={format === 'excel' ? 'default' : 'outline'} 
                onClick={() => setFormat('excel')}
                className="w-full"
              >
                Excel
              </Button>
              <Button 
                type="button"
                variant={format === 'pdf' ? 'default' : 'outline'} 
                onClick={() => setFormat('pdf')}
                className="w-full"
              >
                PDF
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={() => alert(`Exporting ${recordCount} records as ${format.toUpperCase()}...`)}>
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function AddVoterGlobalModal() {
  const { addVoter, wards, houses } = useCampaignStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    gender: 'Male',
    wardId: '',
    houseId: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.wardId || !formData.houseId) {
      toast.error("Name, Ward, and House are required.");
      return;
    }
    addVoter({
      wardId: formData.wardId,
      houseId: formData.houseId,
      name: formData.name,
      mobile: formData.mobile,
      gender: formData.gender,
      age: 30, // Default mock value
      party: 'Neutral',
      contactVolunteer: 'Unassigned',
      status: 'Pending',
    });
    toast.success("Voter added to database.");
    setOpen(false);
    setFormData({ name: '', mobile: '', gender: 'Male', wardId: '', houseId: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" /> Add New Voter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Voter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Voter Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Hasan" />
          </div>
          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="01XXX-XXXXXX" />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ward *</Label>
              <select value={formData.wardId} onChange={e => setFormData({ ...formData, wardId: e.target.value, houseId: '' })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Ward</option>
                {wards.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>House *</Label>
              <select value={formData.houseId} onChange={e => setFormData({ ...formData, houseId: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" disabled={!formData.wardId}>
                <option value="">Select House</option>
                {houses.filter(h => h.wardId === formData.wardId).map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Add Voter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
