/**
 * Zustand Issue Store
 * Manages issue tracker UI state
 */

import { create } from 'zustand';
import { Issue, IssueStatus, IssuePriority } from '../types';

interface IssueState {
  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailModalOpen: boolean;
  isDeleteConfirmOpen: boolean;
  isTimeLogModalOpen: boolean;

  // Selected issue for editing/viewing
  selectedIssue: Issue | null;

  // Filters
  searchQuery: string;
  statusFilters: IssueStatus[];
  priorityFilter: IssuePriority | null;
  projectFilter: string | null;
  assignedToFilter: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;

  // Bulk selection
  selectedIssueIds: Set<string>;

  // Actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (issue: Issue) => void;
  closeEditModal: () => void;
  openDetailModal: (issue: Issue) => void;
  closeDetailModal: () => void;
  openDeleteConfirm: (issue: Issue) => void;
  closeDeleteConfirm: () => void;
  openTimeLogModal: (issue: Issue) => void;
  closeTimeLogModal: () => void;

  setSearchQuery: (query: string) => void;
  setStatusFilters: (statuses: IssueStatus[]) => void;
  setPriorityFilter: (priority: IssuePriority | null) => void;
  setProjectFilter: (projectId: string | null) => void;
  setAssignedToFilter: (userId: string | null) => void;
  clearFilters: () => void;

  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  toggleIssueSelection: (issueId: string) => void;
  selectAllIssues: (issueIds: string[]) => void;
  clearSelection: () => void;
}

export const useIssueStore = create<IssueState>((set) => ({
  // Modal states
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDetailModalOpen: false,
  isDeleteConfirmOpen: false,
  isTimeLogModalOpen: false,

  selectedIssue: null,

  // Filters
  searchQuery: '',
  statusFilters: [],
  priorityFilter: null,
  projectFilter: null,
  assignedToFilter: null,

  // Pagination
  currentPage: 1,
  pageSize: 10,

  // Bulk selection
  selectedIssueIds: new Set(),

  // Modal actions
  openCreateModal: () =>
    set({
      isCreateModalOpen: true,
      selectedIssue: null,
      isEditModalOpen: false,
    }),
  closeCreateModal: () =>
    set({ isCreateModalOpen: false, selectedIssue: null }),

  openEditModal: (issue) =>
    set({
      isEditModalOpen: true,
      selectedIssue: issue,
      isCreateModalOpen: false,
    }),
  closeEditModal: () =>
    set({ isEditModalOpen: false, selectedIssue: null }),

  openDetailModal: (issue) =>
    set({ isDetailModalOpen: true, selectedIssue: issue }),
  closeDetailModal: () =>
    set({ isDetailModalOpen: false, selectedIssue: null }),

  openDeleteConfirm: (issue) =>
    set({ isDeleteConfirmOpen: true, selectedIssue: issue }),
  closeDeleteConfirm: () =>
    set({ isDeleteConfirmOpen: false, selectedIssue: null }),

  openTimeLogModal: (issue) =>
    set({ isTimeLogModalOpen: true, selectedIssue: issue }),
  closeTimeLogModal: () =>
    set({ isTimeLogModalOpen: false }),

  // Filter actions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setStatusFilters: (statuses) =>
    set({ statusFilters: statuses, currentPage: 1 }),
  setPriorityFilter: (priority) =>
    set({ priorityFilter: priority, currentPage: 1 }),
  setProjectFilter: (projectId) =>
    set({ projectFilter: projectId, currentPage: 1 }),
  setAssignedToFilter: (userId) =>
    set({ assignedToFilter: userId, currentPage: 1 }),

  clearFilters: () =>
    set({
      searchQuery: '',
      statusFilters: [],
      priorityFilter: null,
      projectFilter: null,
      assignedToFilter: null,
      currentPage: 1,
    }),

  // Pagination actions
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // Bulk selection actions
  toggleIssueSelection: (issueId) =>
    set((state) => {
      const newSelected = new Set(state.selectedIssueIds);
      if (newSelected.has(issueId)) {
        newSelected.delete(issueId);
      } else {
        newSelected.add(issueId);
      }
      return { selectedIssueIds: newSelected };
    }),

  selectAllIssues: (issueIds) =>
    set({ selectedIssueIds: new Set(issueIds) }),

  clearSelection: () => set({ selectedIssueIds: new Set() }),
}));
