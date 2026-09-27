import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { useCampaignStore } from "@/store/campaignStore"

export type VoterRecord = {
  id: string
  wardId: string
  houseId: string
  name: string
  gender: string
  age: number
  party: string
  mobile: string
  contactVolunteer: string
  status: "Approved" | "Pending" | "Rejected"
  wardName?: string
  houseName?: string
}

export const columns: ColumnDef<VoterRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 font-semibold hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "wardName",
    header: "Ward",
    cell: ({ row }) => <div>{row.getValue("wardName")}</div>,
  },
  {
    accessorKey: "houseName",
    header: "House",
    cell: ({ row }) => <div>{row.getValue("houseName")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 font-semibold hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "party",
    header: "Party",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "contactVolunteer",
    header: "Volunteer",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Approved" ? "success" : status === "Pending" ? "warning" : "destructive"}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const voter = row.original
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
              Copy mobile number
            </DropdownMenuItem>
            {voter.status !== 'Approved' && (
              <DropdownMenuItem onClick={() => (table.options.meta as any)?.onStatusChange(voter.id, 'Approved')}>
                Approve Voter
              </DropdownMenuItem>
            )}
            {voter.status !== 'Rejected' && (
              <DropdownMenuItem onClick={() => (table.options.meta as any)?.onStatusChange(voter.id, 'Rejected')}>
                Reject Voter
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => (table.options.meta as any)?.onEdit(voter)}>
              Edit Voter
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => (table.options.meta as any)?.onDelete(voter)}>
              Delete Voter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function VoterTable({ houseId }: { houseId?: string }) {
  const { voters, wards, houses, updateVoter, deleteVoter } = useCampaignStore();
  const [editingVoter, setEditingVoter] = useState<VoterRecord | null>(null);
  
  const displayedVoters = houseId ? voters.filter(v => v.houseId === houseId) : voters;

  const enrichedVoters = displayedVoters.map(v => ({
    ...v,
    wardName: wards.find(w => w.id === v.wardId)?.name || 'Unknown',
    houseName: houses.find(h => h.id === v.houseId)?.name || 'Unknown'
  }));

  const handleDelete = (voter: VoterRecord) => {
    if (confirm(`Are you sure you want to delete ${voter.name}?`)) {
      deleteVoter(voter.id);
      toast.success(`${voter.name} deleted`);
    }
  }

  return (
    <>
      <DataTable 
        columns={columns} 
        data={enrichedVoters} 
        placeholder="Search voters by name or mobile..."
        meta={{
          onEdit: setEditingVoter,
          onDelete: handleDelete,
          onStatusChange: (id: string, status: string) => {
            updateVoter(id, { status: status as any });
            toast.success(`Voter status updated to ${status}`);
          }
        }}
      />
      
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
    </>
  )
}

export function EditVoterModal({ voter, onClose, onSave }: { voter: VoterRecord, onClose: () => void, onSave: (id: string, updates: any) => void }) {
  const [formData, setFormData] = useState({
    name: voter.name,
    mobile: voter.mobile,
    party: voter.party,
    status: voter.status,
  })

  return (
    <Dialog open={true} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Voter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Party</Label>
              <select value={formData.party} onChange={e => setFormData({ ...formData, party: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Support</option>
                <option>Neutral</option>
                <option>Oppose</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(voter.id, formData)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
