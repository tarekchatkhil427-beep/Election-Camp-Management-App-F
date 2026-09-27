import React from 'react';
import { Check, X, MessageSquare, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const mockApprovals = [
  { id: 'a-1', title: 'Budget for Ward 01 Townhall', submittedBy: 'Rahim Ahmed', date: '2026-09-25', type: 'Events', status: 'Pending' },
  { id: 'a-2', title: 'New Social Media Graphic - Youth', submittedBy: 'Jane Director', date: '2026-09-26', type: 'Social Media', status: 'Pending' },
  { id: 'a-3', title: 'Voter List Update - Block C', submittedBy: 'Alif Hossain', date: '2026-09-24', type: 'Voter Records', status: 'Pending' },
];

export default function ApprovalCenter() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Unified Approval Queue</h2>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 hidden sm:table-cell">Submitted By</th>
                <th className="px-4 py-3 hidden md:table-cell">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockApprovals.map(item => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{item.type}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">{item.submittedBy}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{item.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant="warning">{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="sm">Review</Button>
                      </SheetTrigger>
                      <ReviewDrawer item={item} />
                    </Sheet>
                  </td>
                </tr>
              ))}
              {mockApprovals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No pending approvals.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReviewDrawer({ item }: { item: typeof mockApprovals[0] }) {
  return (
    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
      <SheetHeader className="mb-6 border-b border-border pb-4">
        <Badge variant="outline" className="w-fit mb-2">{item.type}</Badge>
        <SheetTitle className="text-xl">{item.title}</SheetTitle>
        <p className="text-sm text-muted-foreground mt-1">Submitted by {item.submittedBy} on {item.date}</p>
      </SheetHeader>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Details</h3>
          <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm leading-relaxed">
            Please review the attached documents and budget breakdown for the upcoming event. 
            Ensure all compliance guidelines are met before approving.
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Attachments</h3>
          <div className="space-y-2">
            <div className="p-2 bg-card border border-border rounded flex justify-between items-center text-sm">
              <span className="text-primary hover:underline cursor-pointer">budget_proposal_v2.pdf</span>
              <span className="text-muted-foreground text-xs">2.4 MB</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 mt-6 flex flex-col gap-3">
          <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"><Check className="h-4 w-4" /> Approve</Button>
          <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive"><X className="h-4 w-4" /> Reject</Button>
          <Button variant="secondary" className="w-full gap-2"><MessageSquare className="h-4 w-4" /> Request Changes</Button>
        </div>
      </div>
    </SheetContent>
  );
}
