// Core Organization
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

export interface House {
  id: string;
  wardId: string;
  name: string;
  coordinator: string;
  volunteers: number;
  voters: number;
}

// Access & Auth
export interface User {
  id: string;
  name: string;
  role: string;
  scope: string;
  email: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export type Permission = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE' | 'EXPORT';

// People
export interface Volunteer {
  id: string;
  name: string;
  wardId: string;
  houseId: string;
  mobile: string;
  status: 'Active' | 'Inactive';
}

export interface Voter {
  id: string;
  name: string;
  wardId: string;
  houseId: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  party: string;
  mobile: string;
  contactVolunteerId: string;
  status: 'Supportive' | 'Undecided' | 'Opposed';
}

// Operations
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'BACKLOG' | 'ASSIGNED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  ward: string;
  house: string;
  assignee: string;
  priority: TaskPriority;
  deadline: string;
  progress: number;
  status: TaskStatus;
}

export interface Event {
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

export interface CommunityIssue {
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

// Social & Communications
export interface SocialCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface SocialPost {
  id: string;
  campaignId: string;
  platform: 'Facebook' | 'Twitter' | 'Instagram';
  content: string;
  status: 'IDEA' | 'DRAFT' | 'REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED';
  publishDate: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Read';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'Task' | 'Message' | 'Event' | 'Announcement' | 'Alert';
  read: boolean;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}
