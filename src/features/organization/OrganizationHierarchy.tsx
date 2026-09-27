import React from 'react';
import { Building2, Star, User } from 'lucide-react';
import { useCampaignStore } from '@/store/campaignStore';
import { OrgFolderExplorer } from '@/features/organization/OrgFolderExplorer';

export default function OrganizationHierarchy() {
  const { users } = useCampaignStore();

  const candidate = users.find(u => u.role === 'Candidate');
  const director = users.find(u => u.role === 'Campaign Director');

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Hierarchy Explorer</h1>
        <p className="text-muted-foreground mt-1">Read-only visual hierarchy of the campaign organization.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
            <Building2 className="h-6 w-6" />
            Central Campaign
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Candidate</div>
                <div className="font-bold">{candidate?.name || 'Unassigned'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Campaign Director</div>
                <div className="font-bold">{director?.name || 'Unassigned'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <OrgFolderExplorer mode="view" />
    </div>
  );
}
