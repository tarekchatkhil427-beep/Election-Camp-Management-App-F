import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, ExternalLink, Video, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockAssets = [
  { id: 'a-1', name: 'clean_village_poster_v1.jpg', type: 'Image', uploader: 'Jane Director', status: 'Approved', date: '2026-09-25' },
  { id: 'a-2', name: 'volunteer_interview_raw.mp4', type: 'Video', uploader: 'Media Team', status: 'Pending', date: '2026-09-26' },
  { id: 'a-3', name: 'talking_points_draft.docx', type: 'Doc', uploader: 'Abdul Karim', status: 'Approved', date: '2026-09-20' },
];

export default function CampaignWorkspace() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <Button variant="link" className="pl-0 text-muted-foreground mb-4 self-start" onClick={() => navigate('/social/campaigns')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Campaigns
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Clean Village Initiative</h1>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-muted-foreground">Campaign Workspace • Oct 01 - Oct 31, 2026</p>
          </div>
          <Button>Create Content</Button>
        </div>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="mb-6 bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">Overview</TabsTrigger>
          <TabsTrigger value="assets" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">Assets (Drive)</TabsTrigger>
          <TabsTrigger value="content" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">Content Pipeline</TabsTrigger>
          <TabsTrigger value="posts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">Published Posts</TabsTrigger>
          <TabsTrigger value="approvals" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            Campaign Overview Metrics (Coming Soon)
          </div>
        </TabsContent>

        <TabsContent value="assets">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockAssets.map(asset => (
              <div key={asset.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col group">
                {/* Thumbnail Placeholder */}
                <div className="h-32 bg-muted flex items-center justify-center border-b border-border">
                  {asset.type === 'Image' && <ImageIcon className="h-8 w-8 text-muted-foreground/50" />}
                  {asset.type === 'Video' && <Video className="h-8 w-8 text-muted-foreground/50" />}
                  {asset.type === 'Doc' && <FileText className="h-8 w-8 text-muted-foreground/50" />}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-semibold text-sm truncate mb-1" title={asset.name}>{asset.name}</h4>
                  <div className="flex items-center justify-between mt-auto mb-3 text-xs text-muted-foreground">
                    <span>{asset.type} • {asset.uploader}</span>
                    <Badge variant={asset.status === 'Approved' ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">{asset.status}</Badge>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full gap-2 text-xs" onClick={() => window.open('https://drive.google.com', '_blank')}>
                    <ExternalLink className="h-3.5 w-3.5" /> Open in Drive
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            Use the global Content Calendar to view the pipeline.
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            Live Posts Sync (Coming Soon)
          </div>
        </TabsContent>

        <TabsContent value="approvals">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            Approval Workflows (Coming Soon)
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
