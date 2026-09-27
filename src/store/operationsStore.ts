import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'BACKLOG' | 'ASSIGNED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  ward: string;
  house: string;
  assignee: string;
  priority: Priority;
  deadline: string;
  progress: number;
  status: TaskStatus;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  time: string;
  ward: string;
  house: string;
  organizer: string;
  participants: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

interface OperationsState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'progress' | 'status'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id'>) => void;
  deleteEvent: (id: string) => void;
}

const initialTasks: Task[] = Array.from({ length: 1000 }).map((_, i) => ({
  id: `t-${i + 1}`,
  title: ['Distribute Leaflets', 'Verify Voter List', 'Setup stage', 'Draft announcement', 'Order banners', 'Door to door campaign', 'Volunteer coordination'][i % 7] + ` (Task ${i + 1})`,
  ward: `Ward ${String((i % 4) + 1).padStart(2, '0')}`,
  house: `House ${String((i % 12) + 1).padStart(2, '0')}`,
  assignee: ['Alif Hossain', 'Farzana Begum', 'Kamrul Hasan', 'Jane Director', 'Abdul Karim'][i % 5],
  priority: ['High', 'Medium', 'Low'][i % 3] as Priority,
  deadline: `2026-10-${String((i % 30) + 1).padStart(2, '0')}`,
  progress: (i * 10) % 100,
  status: ['BACKLOG', 'ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'][i % 5] as TaskStatus,
}));

const initialEvents: EventItem[] = [
  { id: 'ev-1', name: 'Ward 01 Townhall Rally', date: '2026-10-15', time: '16:00', ward: 'Ward 01', house: 'N/A', organizer: 'Abdul Karim', participants: 150, status: 'Scheduled' },
  { id: 'ev-2', name: 'House 07 Volunteer Training', date: '2026-09-28', time: '10:00', ward: 'Ward 01', house: 'House 07', organizer: 'Rahim Ahmed', participants: 45, status: 'Completed' },
];

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      addTask: (taskData) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...taskData,
            id: `t-${Math.random().toString(36).substr(2, 9)}`,
            progress: 0,
            status: 'BACKLOG',
          }
        ]
      })),
      updateTaskStatus: (id, status) => set((state) => ({
        tasks: state.tasks.map(t => {
          if (t.id === id) {
            let progress = t.progress;
            if (status === 'COMPLETED') progress = 100;
            else if (status === 'BACKLOG' || status === 'ASSIGNED') progress = 0;
            return { ...t, status, progress };
          }
          return t;
        })
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      events: initialEvents,
      addEvent: (eventData) => set((state) => ({
        events: [
          ...state.events,
          { ...eventData, participants: 0, id: `ev-${Math.random().toString(36).substr(2, 9)}` }
        ]
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),
    }),
    {
      name: 'operations-store',
    }
  )
);
