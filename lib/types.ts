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
  assignedToId?: string;
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
  assignedToId?: string;
  page?: number;
  pageSize?: number;
}
