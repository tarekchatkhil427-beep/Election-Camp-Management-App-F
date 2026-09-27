import React, { useState } from 'react';
import { Search, Plus, LayoutGrid, List, AlertTriangle, MessageSquare, Camera, CheckCircle2, Clock, MapPin, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIssuesStore, IssueItem } from '@/store/issuesStore';
import { toast } from 'sonner';

export default function IssuesDashboard() {
  const { issues, deleteIssue } = useIssuesStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete issue "${title}"?`)) {
      deleteIssue(id);
      toast.success("Issue deleted.");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-8 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Community Issues</h1>
          <p className="text-muted-foreground mt-1">Track and resolve problems reported by volunteers and residents.</p>
        </div>
        <AddIssueModal />
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-full max-w-sm flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
              <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('grid')}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">All Wards</option>
            <option value="w1">Ward 01</option>
            <option value="w2">Ward 02</option>
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">All Categories</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="VERIFIED">Verified</option>
            <option value="IN PROGRESS">In Progress</option>
          </select>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {issues.length === 0 ? (
            <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
              No issues found.
            </div>
          ) : issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Issue Title</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-32 text-center text-muted-foreground">
                      No issues found.
                    </td>
                  </tr>
                ) : issues.map(issue => (
                  <tr key={issue.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{issue.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{issue.ward} • {issue.house}</td>
                    <td className="px-4 py-3">{issue.category}</td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{issue.date}</td>
                    <td className="px-4 py-3 text-right">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm">View</Button>
                        </SheetTrigger>
                        <IssueDetailDrawer issue={issue} />
                      </Sheet>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2" onClick={() => handleDelete(issue.id, issue.title)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: IssueItem['priority'] }) {
  const colors = {
    Critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    High: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    Medium: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    Low: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
  };
  return <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider", colors[priority])}>{priority}</span>;
}

function StatusBadge({ status }: { status: IssueItem['status'] }) {
  const colors = {
    'NEW': 'bg-blue-100 text-blue-800 border-blue-200',
    'VERIFIED': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'ASSIGNED': 'bg-amber-100 text-amber-800 border-amber-200',
    'IN_PROGRESS': 'bg-purple-100 text-purple-800 border-purple-200',
    'RESOLVED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'ARCHIVED': 'bg-slate-100 text-slate-800 border-slate-200',
  };
  return <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider dark:bg-opacity-30", colors[status as keyof typeof colors] || colors['NEW'])}>{status.replace('_', ' ')}</span>;
}

function IssueCard({ issue, onDelete }: { issue: IssueItem, onDelete?: (id: string, title: string) => void }) {
  return (
    <div className="relative group">
      <Sheet>
        <SheetTrigger asChild>
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer flex flex-col text-left h-full">
            <div className="flex justify-between items-start mb-3 gap-2">
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
            </div>
            
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors pr-6">{issue.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{issue.description}</p>
            
            <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-border/50 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{issue.ward} • {issue.house}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{issue.date}</span>
                </div>
                {issue.photos > 0 && (
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    <Camera className="h-3 w-3" />
                    <span className="font-medium">{issue.photos}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetTrigger>
        <IssueDetailDrawer issue={issue} />
      </Sheet>
      {onDelete && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive/10" 
          onClick={(e) => { e.stopPropagation(); onDelete(issue.id, issue.title); }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function IssueDetailDrawer({ issue }: { issue: IssueItem }) {
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  const handleGenerateBrief = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDraft(`SOCIAL MEDIA DRAFT:\n\nAttention ${issue.ward} Residents:\n\nWe are aware of the "${issue.title}" issue reported on ${issue.date}. Our team has categorized this as a ${issue.priority} priority under ${issue.category}.\n\nCurrent Status: ${issue.status}.\n\nWe are working diligently to resolve this to ensure community safety. Thank you for your patience.\n\n#CampaignOS #CommunityFirst`);
    }, 1500);
  };

  return (
    <SheetContent className="w-full sm:max-w-lg xl:max-w-xl overflow-y-auto">
      <SheetHeader className="mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2 mb-2">
          <PriorityBadge priority={issue.priority} />
          <StatusBadge status={issue.status} />
        </div>
        <SheetTitle className="text-2xl">{issue.title}</SheetTitle>
        <p className="text-sm text-muted-foreground mt-1">Reported by {issue.reportedBy} on {issue.date}</p>
      </SheetHeader>

      <div className="space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm leading-relaxed">
          <span className="font-semibold block mb-1">Description</span>
          {issue.description}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Category</span>
            <p className="text-sm font-medium">{issue.category}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Location</span>
            <p className="text-sm font-medium">{issue.ward} • {issue.house}</p>
          </div>
        </div>

        {issue.photos > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Camera className="h-4 w-4" /> Photos ({issue.photos})</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[...Array(issue.photos)].map((_, i) => (
                <div key={i} className="h-24 w-32 bg-muted rounded-md border border-border flex items-center justify-center shrink-0">
                  <span className="text-xs text-muted-foreground">Photo {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Content Strategy</h3>
          </div>
          
          {!draft ? (
            <Button onClick={handleGenerateBrief} disabled={generating} className="w-full gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
              {generating ? 'Generating AI Brief...' : 'Generate Content Brief'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm whitespace-pre-wrap font-medium">
                {draft}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setDraft(null)}>Clear Draft</Button>
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  );
}

function AddIssueModal() {
  const { addIssue } = useIssuesStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    ward: '',
    house: '',
    priority: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    reportedBy: ''
  });

  const handleSubmit = () => {
    if (!formData.title) {
      toast.error("Issue Title is required.");
      return;
    }
    addIssue({
      title: formData.title,
      description: formData.description || 'No description provided.',
      category: formData.category,
      ward: formData.ward || 'Unknown Ward',
      house: formData.house || 'Unknown House',
      priority: formData.priority,
      reportedBy: formData.reportedBy || 'Anonymous',
      photos: 0
    });
    toast.success("Issue reported successfully.");
    setOpen(false);
    setFormData({ title: '', description: '', category: 'Infrastructure', ward: '', house: '', priority: 'Medium', reportedBy: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Report Issue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Community Issue</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Issue Title *</Label>
            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Broken Water Pipe" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed description of the problem..." />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option>Infrastructure</option>
              <option>Water</option>
              <option>Electricity</option>
              <option>Security</option>
              <option>Administrative</option>
              <option>Sanitation</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Ward</Label>
            <Input value={formData.ward} onChange={e => setFormData({ ...formData, ward: e.target.value })} placeholder="e.g. Ward 01" />
          </div>
          <div className="space-y-2">
            <Label>House / Location</Label>
            <Input value={formData.house} onChange={e => setFormData({ ...formData, house: e.target.value })} placeholder="e.g. House 07" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Reported By</Label>
            <Input value={formData.reportedBy} onChange={e => setFormData({ ...formData, reportedBy: e.target.value })} placeholder="Name of reporter" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Upload Photos (Mock)</Label>
            <Input type="file" multiple className="cursor-pointer" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>Submit Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
