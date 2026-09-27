import React from 'react';
import { useAuth } from '@/auth/MockAuthProvider';
import { CandidateDashboard } from '@/components/dashboard/CandidateDashboard';
import { DirectorDashboard } from '@/components/dashboard/DirectorDashboard';
import { WardCoordDashboard } from '@/components/dashboard/WardCoordDashboard';
import { HouseCoordDashboard } from '@/components/dashboard/HouseCoordDashboard';
import { VolunteerDashboard } from '@/components/dashboard/VolunteerDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  // Render role-specific dashboard
  switch (user.role) {
    case 'SUPER_ADMIN':
    case 'CANDIDATE':
      return <CandidateDashboard />;
    
    case 'CAMPAIGN_DIRECTOR':
      return <DirectorDashboard />;
    
    case 'WARD_COORDINATOR':
      return <WardCoordDashboard />;
    
    case 'HOUSE_COORDINATOR':
      return <HouseCoordDashboard />;
    
    case 'VOLUNTEER':
      return <VolunteerDashboard />;
      
    default:
      return (
        <div className="p-8 text-center text-muted-foreground">
          <p>No dashboard configured for your role.</p>
        </div>
      );
  }
}
