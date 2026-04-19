/**
 * TypeScript Type Definitions
 */

// User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Auth
export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'closed';

export interface Project {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

// Issue Status and Priority
export type IssueStatus = 'open' | 'in-progress' | 'closed' | 'on-hold';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

// Issue
export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  projectId?: string;
  project?: Project;
  parentIssueId?: string;
  parentIssue?: Pick<Issue, 'id' | 'title' | 'status'>;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

// Issue Form Data
export interface IssueFormData {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  projectId?: string;
  parentIssueId?: string;
  assignedToId?: string;
}

export interface ProjectFormData {
  name: string;
  code?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface TimeEntry {
  id: string;
  issueId: string;
  issue?: Pick<Issue, 'id' | 'title' | 'project' | 'projectId'>;
  userId: string;
  user?: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
  date: string;
  hours: number;
  activity:
  | 'requirements-definition'
  | 'basic-design'
  | 'implementation'
  | 'review'
  | 'api-test'
  | 'system-test'
  | 'acceptance-test'
  | 'release'
  | 'investigation'
  | 'meeting'
  | 'project-management'
  | 'other';
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntryFormData {
  issueId: string;
  date: string;
  hours: number;
  activity: TimeEntry['activity'];
  comment: string;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Options
export interface IssueFilters {
  search?: string;
  status?: IssueStatus[];
  priority?: IssuePriority;
  projectId?: string;
  assignedToId?: string;
  page?: number;
  pageSize?: number;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
}

export interface TimeEntryFilters {
  userId?: string;
  issueId?: string;
  projectId?: string;
  activity?: TimeEntry['activity'];
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}
