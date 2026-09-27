import React from 'react';
import { Building2, Star, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCampaignStore } from '@/store/campaignStore';
import { OrgFolderExplorer } from '@/features/organization/OrgFolderExplorer';

export default function OrganizationHierarchy() {
  const { t } = useTranslation();
  const { users } = useCampaignStore();

  const candidate = users.find(u => u.role === 'Candidate');
  const director = users.find(u => u.role === 'Campaign Director');

  return (
    <div className="max-w-7xl mx-auto pb-8 space-y-4 sm:space-y-6">
      <div className="mb-2 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{t('Hierarchy Explorer') || 'Hierarchy Explorer'}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('Read-only visual hierarchy of the campaign organization.') || 'Read-only visual hierarchy of the campaign organization.'}</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-3 sm:p-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-xl font-bold text-primary mb-3 sm:mb-4">
            <Building2 className="h-4 w-4 sm:h-6 sm:w-6" />
            {t('Central Campaign') || 'Central Campaign'}
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg border border-border">
              <div className="h-6 w-6 sm:h-10 sm:w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <Star className="h-3 w-3 sm:h-5 sm:w-5" />
              </div>
              <div className="overflow-hidden w-full">
                <div className="text-[9px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">{t('Candidate') || 'Candidate'}</div>
                <div className="text-[11px] sm:text-base font-bold truncate">{candidate?.name || t('Unassigned') || 'Unassigned'}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg border border-border">
              <div className="h-6 w-6 sm:h-10 sm:w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <User className="h-3 w-3 sm:h-5 sm:w-5" />
              </div>
              <div className="overflow-hidden w-full">
                <div className="text-[9px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">{t('Campaign Director') || 'Campaign Director'}</div>
                <div className="text-[11px] sm:text-base font-bold truncate">{director?.name || t('Unassigned') || 'Unassigned'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Folder Explorer Mode */}
      <OrgFolderExplorer mode="admin" />
    </div>
  );
}
