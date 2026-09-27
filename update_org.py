import os

file_path = 'src/features/organization/OrgFolderExplorer.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Ward Grid
content = content.replace(
    'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in',
    'className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 animate-in'
)
# Make ward padding smaller
content = content.replace(
    'p-6 flex flex-col"',
    'p-3 sm:p-6 flex flex-col"'
)
content = content.replace(
    'font-bold text-xl',
    'font-bold text-sm sm:text-xl'
)
content = content.replace(
    'text-sm text-muted-foreground mt-1',
    'text-[10px] sm:text-sm text-muted-foreground mt-0 sm:mt-1'
)
content = content.replace(
    'h-24 w-24 -mt-8 -mr-8',
    'h-12 w-12 sm:h-24 sm:w-24 -mt-2 -mr-2 sm:-mt-8 sm:-mr-8'
)

# Replace House Grid
content = content.replace(
    'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in',
    'className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 animate-in'
)
# Make house padding smaller
content = content.replace(
    'p-5 flex flex-col"',
    'p-2 sm:p-5 flex flex-col"'
)
content = content.replace(
    'font-bold text-lg',
    'font-bold text-[11px] sm:text-lg'
)
content = content.replace(
    'h-20 w-20 -mt-6 -mr-6',
    'h-10 w-10 sm:h-20 sm:w-20 -mt-2 -mr-2 sm:-mt-6 sm:-mr-6'
)

# Replace Volunteer Layout
# First, find the space-y-4 wrapper
content = content.replace(
    'className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[600px] scrollbar-thin"',
    'className="p-2 sm:p-4 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin"'
)

vol_replacement = """
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {houseVolunteers.map(vol => (
                      <CompactVolunteerCard
                        key={vol.id}
                        volunteer={vol}
                        onEdit={mode === 'admin' ? () => setEditingVolunteer(vol) : undefined}
                        onDelete={mode === 'admin' ? () => handleDeleteVolunteer(vol.id, vol.name) : undefined}
                      />
                    ))}
                  </div>
                )}
"""
content = content.replace(
    """) : houseVolunteers.map(vol => (
                  <VolunteerProfile 
                    key={vol.id} 
                    volunteer={vol} 
                    onEdit={mode === 'admin' ? () => setEditingVolunteer(vol) : undefined}
                    onDelete={mode === 'admin' ? () => handleDeleteVolunteer(vol.id, vol.name) : undefined}
                  />
                ))}""",
    vol_replacement.strip()
)

# Insert CompactVolunteerCard definition at the bottom of imports / before OrgFolderExplorer
compact_card = """
import { Copy, UserCircle2, PhoneCall } from 'lucide-react';

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

"""

if "CompactVolunteerCard" not in content:
    # Add imports to the top
    content = content.replace("import { ChevronRight", "import { Copy, PhoneCall, ChevronRight")
    # Add definition before export function OrgFolderExplorer
    content = content.replace("export function OrgFolderExplorer", compact_card + "export function OrgFolderExplorer")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("OrgFolderExplorer successfully updated!")
