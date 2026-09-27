import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MockRole = 
  | 'SUPER_ADMIN' 
  | 'CANDIDATE' 
  | 'CAMPAIGN_DIRECTOR' 
  | 'WARD_COORDINATOR' 
  | 'HOUSE_COORDINATOR' 
  | 'VOLUNTEER';

export interface MockScope {
  wardId?: string;
  houseId?: string;
}

export interface MockUser {
  id: string;
  name: string;
  role: MockRole;
  scope?: MockScope;
  avatarUrl?: string;
}

interface AuthContextType {
  user: MockUser | null;
  switchUser: (user: MockUser) => void;
  hasRole: (roles: MockRole[]) => boolean;
  hasScope: (wardId?: string, houseId?: string) => boolean;
}

const mockUsers: MockUser[] = [
  { id: '1', name: 'Admin User', role: 'SUPER_ADMIN' },
  { id: '2', name: 'The Candidate', role: 'CANDIDATE' },
  { id: '3', name: 'Jane Director', role: 'CAMPAIGN_DIRECTOR' },
  { id: '4', name: 'Ward Coord 01', role: 'WARD_COORDINATOR', scope: { wardId: 'w-01' } },
  { id: '5', name: 'House Coord 01', role: 'HOUSE_COORDINATOR', scope: { wardId: 'w-01', houseId: 'h-01' } },
  { id: '6', name: 'Volunteer Alice', role: 'VOLUNTEER', scope: { wardId: 'w-01', houseId: 'h-01' } },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  // Default to Super Admin for development
  const [user, setUser] = useState<MockUser>(mockUsers[0]);

  const switchUser = (newUser: MockUser) => setUser(newUser);

  const hasRole = (roles: MockRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasScope = (targetWardId?: string, targetHouseId?: string) => {
    if (!user) return false;
    if (['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR'].includes(user.role)) return true;
    
    if (user.role === 'WARD_COORDINATOR') {
      return user.scope?.wardId === targetWardId;
    }

    if (['HOUSE_COORDINATOR', 'VOLUNTEER'].includes(user.role)) {
      return user.scope?.wardId === targetWardId && user.scope?.houseId === targetHouseId;
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, switchUser, hasRole, hasScope }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};

export { mockUsers };
