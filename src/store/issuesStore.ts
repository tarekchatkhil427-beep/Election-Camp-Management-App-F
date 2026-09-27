import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IssueItem {
  id: string;
  title: string;
  description: string;
  category: string;
  ward: string;
  house: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'NEW' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
  reportedBy: string;
  date: string;
  photos: number;
}

interface IssuesState {
  issues: IssueItem[];
  addIssue: (issue: Omit<IssueItem, 'id' | 'status' | 'date'>) => void;
  updateIssueStatus: (id: string, status: IssueItem['status']) => void;
  deleteIssue: (id: string) => void;
}

const initialIssues: IssueItem[] = [
  { id: 'iss-1', title: 'Broken Water Pipe', description: 'Main pipe leaking heavily near Block A entrance.', category: 'Infrastructure', ward: 'Ward 01', house: 'House 07', priority: 'High', status: 'NEW', reportedBy: 'Alif Hossain', date: '2026-09-27', photos: 2 },
  { id: 'iss-2', title: 'Streetlight out', description: 'Streetlight opposite to the mosque is not working.', category: 'Utility', ward: 'Ward 01', house: 'House 12', priority: 'Medium', status: 'VERIFIED', reportedBy: 'Farzana Begum', date: '2026-09-26', photos: 1 },
  { id: 'iss-3', title: 'Drainage blockage', description: 'Water logging after recent rain.', category: 'Sanitation', ward: 'Ward 02', house: 'N/A', priority: 'High', status: 'IN_PROGRESS', reportedBy: 'Kamrul Hasan', date: '2026-09-25', photos: 0 },
  { id: 'iss-4', title: 'Voter card mismatch', description: 'Several seniors reported wrong DOB on cards.', category: 'Administrative', ward: 'Ward 03', house: 'House 01', priority: 'Medium', status: 'ASSIGNED', reportedBy: 'Abdul Karim', date: '2026-09-24', photos: 3 },
];

export const useIssuesStore = create<IssuesState>()(
  persist(
    (set) => ({
      issues: initialIssues,
      addIssue: (issueData) => set((state) => ({
        issues: [
          {
            ...issueData,
            id: `iss-${Math.random().toString(36).substr(2, 9)}`,
            status: 'NEW',
            date: new Date().toISOString().split('T')[0],
            photos: 0
          },
          ...state.issues
        ]
      })),
      updateIssueStatus: (id, status) => set((state) => ({
        issues: state.issues.map(i => i.id === id ? { ...i, status } : i)
      })),
      deleteIssue: (id) => set((state) => ({
        issues: state.issues.filter(i => i.id !== id)
      }))
    }),
    {
      name: 'issues-store',
    }
  )
);
