import { Voter, Task, Issue, Ward, House } from './types';

// Mock Services architecture - later replaced by Firebase functions/repositories
export const mockVoterService = {
  getVoters: async (): Promise<Voter[]> => {
    // Return empty for now, will be populated later
    return [];
  },
  getVoterById: async (id: string): Promise<Voter | null> => {
    return null;
  }
};

export const mockTaskService = {
  getTasks: async (): Promise<Task[]> => {
    return [];
  }
};

export const mockOrganizationService = {
  getWards: async (): Promise<Ward[]> => {
    return [];
  },
  getHouses: async (wardId: string): Promise<House[]> => {
    return [];
  }
};
