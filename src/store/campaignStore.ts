import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ward {
  id: string;
  name: string;
  code: string;
  coordinator: string;
  houses: number;
  volunteers: number;
  activeTasks: number;
  events: number;
  status: 'Active' | 'Inactive';
}

export interface User {
  id: string;
  name: string;
  role: string;
  scope: string;
  email: string;
  mobile?: string;
  password?: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface House {
  id: string;
  wardId: string;
  name: string;
  coordinator: string;
  volunteers: number;
  voters: number;
  tasks: number;
  events: number;
  status: 'Active' | 'Inactive';
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  wardId: string;
  houseId: string;
  phone: string;
  status: 'Active' | 'Inactive';
  taskCount: number;
}

export interface Voter {
  id: string;
  wardId: string;
  houseId: string;
  name: string;
  gender: string;
  age: number;
  party: string;
  mobile: string;
  contactVolunteer: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface SocialPost {
  id: string;
  date: string;
  contentTitle: string;
  caption: string;
  assigneeId: string;
  status: 'Draft' | 'Scheduled' | 'Published';
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Planned' | 'Completed';
  startDate: string;
  endDate: string;
  budget: string;
  spent: string;
}

export interface AppSettings {
  campaignName: string;
  candidateName: string;
  electionType: string;
  electionDate: string;
  location: string;
  primaryColor: string;
  theme: 'Light' | 'Dark' | 'System';
  language: string;
  density: string;
}

interface CampaignState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  wards: Ward[];
  addWard: (ward: Omit<Ward, 'id' | 'houses' | 'volunteers' | 'activeTasks' | 'events'>) => void;
  updateWard: (id: string, updates: Partial<Ward>) => void;
  deleteWard: (id: string) => void;

  houses: House[];
  addHouse: (house: Omit<House, 'id' | 'volunteers' | 'voters' | 'tasks' | 'events'>) => void;
  updateHouse: (id: string, updates: Partial<House>) => void;
  deleteHouse: (id: string) => void;

  volunteers: Volunteer[];
  addVolunteer: (vol: Omit<Volunteer, 'id' | 'taskCount'>) => void;
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => void;
  deleteVolunteer: (id: string) => void;

  voters: Voter[];
  addVoter: (voter: Omit<Voter, 'id'>) => void;
  updateVoter: (id: string, updates: Partial<Voter>) => void;
  deleteVoter: (id: string) => void;

  users: User[];
  addUser: (user: Omit<User, 'id' | 'status' | 'lastActive'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  updateUserStatus: (id: string, status: 'Active' | 'Inactive') => void;
  deleteUser: (id: string) => void;

  socialPosts: SocialPost[];
  addSocialPost: (post: Omit<SocialPost, 'id'>) => void;
  updateSocialPost: (id: string, updates: Partial<SocialPost>) => void;
  deleteSocialPost: (id: string) => void;

  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
}

const initialWards: Ward[] = [
  { id: 'w-1', name: 'Ward 01', code: 'W-01', coordinator: 'Abdul Karim', houses: 45, volunteers: 120, activeTasks: 5, events: 2, status: 'Active' },
  { id: 'w-2', name: 'Ward 02', code: 'W-02', coordinator: 'Jane Director', houses: 32, volunteers: 85, activeTasks: 3, events: 0, status: 'Active' },
  { id: 'w-3', name: 'Ward 03', code: 'W-03', coordinator: 'Rahim Ahmed', houses: 50, volunteers: 150, activeTasks: 12, events: 4, status: 'Active' },
];

const initialHouses: House[] = [
  { id: 'h-1', wardId: 'w-1', name: 'House 01', coordinator: 'Rahim Ahmed', volunteers: 12, voters: 250, tasks: 5, events: 1, status: 'Active' },
  { id: 'h-2', wardId: 'w-1', name: 'House 02', coordinator: 'Salma Begum', volunteers: 8, voters: 180, tasks: 2, events: 0, status: 'Active' },
];

const initialVolunteers: Volunteer[] = [
  { id: 'v-1', name: 'Volunteer A', role: 'Door-to-door', wardId: 'w-1', houseId: 'h-1', phone: '01711000001', status: 'Active', taskCount: 4 },
  { id: 'v-2', name: 'Volunteer B', role: 'Data Entry', wardId: 'w-1', houseId: 'h-1', phone: '01711000002', status: 'Active', taskCount: 2 },
  { id: 'v-3', name: 'Volunteer C', role: 'Event Staff', wardId: 'w-1', houseId: 'h-1', phone: '01711000003', status: 'Inactive', taskCount: 0 },
];

const initialVoters: Voter[] = Array.from({ length: 500 }).map((_, i) => ({
  id: `vot-${i + 1}`,
  wardId: i % 2 === 0 ? 'w-1' : 'w-2',
  houseId: i % 2 === 0 ? 'h-1' : 'h-2',
  name: ['Md. Rafiqul Islam', 'Fatema Begum', 'Hasan Mahmud', 'Ayesha Siddiqa', 'Kamal Uddin', 'Sumi Akter', 'Nazmul Huda'][i % 7] + (i > 6 ? ` ${i}` : ''),
  gender: i % 2 === 0 ? 'Male' : 'Female',
  age: 20 + (i * 7 % 45),
  party: ['Neutral', 'Support', 'Oppose', 'Support', 'Neutral'][i % 5],
  mobile: `01${7 + (i % 3)}11${String(223344 + i).padStart(6, '0')}`,
  contactVolunteer: ['Alif Hossain', 'Farzana Begum', 'Kamrul Hasan', 'Unassigned'][i % 4],
  status: ['Approved', 'Pending', 'Rejected', 'Approved', 'Approved'][i % 5] as any,
}));

const initialUsers: User[] = [
  { id: 'usr-1', name: 'Tariq Rahman', role: 'Super Admin', scope: 'Global', email: 'tariq@campaign.org', status: 'Active', lastActive: 'Just now' },
  { id: 'usr-2', name: 'Jane Director', role: 'Campaign Director', scope: 'Global', email: 'jane@campaign.org', status: 'Active', lastActive: '2 hours ago' },
  { id: 'usr-3', name: 'Abdul Karim', role: 'Ward Coordinator', scope: 'Ward 01', email: 'akarim@campaign.org', status: 'Active', lastActive: '1 day ago' },
  { id: 'usr-4', name: 'Farzana Begum', role: 'Volunteer', scope: 'Ward 01 • House 07', email: 'farzana@campaign.org', status: 'Inactive', lastActive: '3 weeks ago' },
];

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set) => ({
      settings: {
        campaignName: 'Clean Village Initiative',
        candidateName: 'Jane Doe',
        electionType: 'Local Government',
        electionDate: '2026-11-04',
        location: 'Dhaka North City Corporation',
        primaryColor: '#000000',
        theme: 'Light',
        language: 'English (US)',
        density: 'Comfortable (Default)'
      },
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      wards: initialWards,
      addWard: (wardData) => set((state) => ({
        wards: [
          ...state.wards,
          {
            ...wardData,
            id: `w-${Math.random().toString(36).substr(2, 9)}`,
            houses: 0,
            volunteers: 0,
            activeTasks: 0,
            events: 0,
          }
        ]
      })),
      updateWard: (id, updates) => set((state) => ({
        wards: state.wards.map(w => w.id === id ? { ...w, ...updates } : w)
      })),
      deleteWard: (id) => set((state) => ({
        wards: state.wards.filter(w => w.id !== id)
      })),

      houses: initialHouses,
      addHouse: (houseData) => set((state) => ({
        houses: [
          ...state.houses,
          {
            ...houseData,
            id: `h-${Math.random().toString(36).substr(2, 9)}`,
            volunteers: 0,
            voters: 0,
            tasks: 0,
            events: 0,
          }
        ]
      })),
      updateHouse: (id, updates) => set((state) => ({
        houses: state.houses.map(h => h.id === id ? { ...h, ...updates } : h)
      })),
      deleteHouse: (id) => set((state) => ({
        houses: state.houses.filter(h => h.id !== id)
      })),

      volunteers: initialVolunteers,
      addVolunteer: (volData) => set((state) => ({
        volunteers: [
          ...state.volunteers,
          {
            ...volData,
            id: `v-${Math.random().toString(36).substr(2, 9)}`,
            taskCount: 0,
          }
        ]
      })),
      updateVolunteer: (id, updates) => set((state) => ({
        volunteers: state.volunteers.map(v => v.id === id ? { ...v, ...updates } : v)
      })),
      deleteVolunteer: (id) => set((state) => ({
        volunteers: state.volunteers.filter(v => v.id !== id)
      })),

      voters: initialVoters,
      addVoter: (voterData) => set((state) => ({
        voters: [
          ...state.voters,
          {
            ...voterData,
            id: `vot-${Math.random().toString(36).substr(2, 9)}`,
          }
        ]
      })),
      updateVoter: (id, updates) => set((state) => ({
        voters: state.voters.map(v => v.id === id ? { ...v, ...updates } : v)
      })),
      deleteVoter: (id) => set((state) => ({
        voters: state.voters.filter(v => v.id !== id)
      })),

      users: initialUsers,
      addUser: (userData) => set((state) => ({
        users: [
          ...state.users,
          {
            ...userData,
            id: `usr-${Math.random().toString(36).substr(2, 9)}`,
            status: 'Active',
            lastActive: 'Never'
          }
        ]
      })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
      })),
      updateUserStatus: (id, status) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, status } : u)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),

      socialPosts: [],
      addSocialPost: (post) => set((state) => ({
        socialPosts: [...state.socialPosts, { ...post, id: `sp-${Math.random().toString(36).substr(2, 9)}` }]
      })),
      updateSocialPost: (id, updates) => set((state) => ({
        socialPosts: state.socialPosts.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteSocialPost: (id) => set((state) => ({
        socialPosts: state.socialPosts.filter(p => p.id !== id)
      })),

      campaigns: [
        { id: 'c-1', name: 'Clean Village Initiative', status: 'Active', startDate: '2026-10-01', endDate: '2026-10-31', budget: '0', spent: '0' },
        { id: 'c-2', name: 'Youth Empowerment Drive', status: 'Planned', startDate: '2026-11-01', endDate: '2026-11-15', budget: '0', spent: '0' }
      ],
      addCampaign: (campaign) => set((state) => ({
        campaigns: [...state.campaigns, { ...campaign, id: `c-${Math.random().toString(36).substr(2, 9)}` }]
      }))
    }),
    {
      name: 'campaign-os-storage', // key in localStorage
    }
  )
);
