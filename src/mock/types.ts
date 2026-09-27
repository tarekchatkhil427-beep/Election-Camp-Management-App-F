// Base Entity interface mimicking Firebase/Firestore standard fields
export interface BaseEntity {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  createdBy: string; // User ID
  updatedBy: string; // User ID
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'PENDING' | 'RESOLVED';
}

// Organizational Entities
export interface Campaign extends BaseEntity {
  name: string;
  candidateName: string;
  electionDate: string;
}

export interface Ward extends BaseEntity {
  campaignId: string;
  wardNumber: string;
  name: string;
  coordinatorId?: string;
}

export interface House extends BaseEntity {
  wardId: string;
  houseNumber: string;
  address: string;
  coordinatorId?: string;
}

// People
export interface Voter extends BaseEntity {
  wardId: string;
  houseId: string;
  fullName: string;
  nidNumber?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  supportLevel: 'STRONG_SUPPORT' | 'LEANING_SUPPORT' | 'UNDECIDED' | 'LEANING_OPPOSE' | 'STRONG_OPPOSE';
  assignedVolunteerId?: string;
  lastContactedAt?: string;
}

export interface Volunteer extends BaseEntity {
  wardId?: string;
  houseId?: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  skills: string[];
}

// Operations
export interface Task extends BaseEntity {
  title: string;
  description: string;
  assigneeId?: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  taskStatus: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  wardId?: string;
  houseId?: string;
}

export interface Event extends BaseEntity {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  organizerId: string;
  wardId?: string;
  attendeesCount: number;
}

export interface Issue extends BaseEntity {
  title: string;
  description: string;
  category: 'INFRASTRUCTURE' | 'WATER' | 'ELECTRICITY' | 'SECURITY' | 'OTHER';
  wardId: string;
  reportedById: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  issueStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}
