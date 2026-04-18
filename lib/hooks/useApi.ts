/**
 * TankStack Query Hooks for API Integration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/config';
import {
  SignInPayload,
  SignUpPayload,
  AuthResponse,
  Issue,
  IssueFormData,
  PaginatedResponse,
  IssueFilters,
  User,
} from '../types';
import axios from 'axios';

// ============ AUTH QUERIES ============

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const response = await getApiClient().post<AuthResponse>(
        API_ENDPOINTS.auth.signin,
        payload
      );
      return response.data;
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const response = await getApiClient().post<AuthResponse>(
        API_ENDPOINTS.auth.signup,
        payload
      );
      return response.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await getApiClient().post(API_ENDPOINTS.auth.logout);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useGetCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await getApiClient().get<User>(
        API_ENDPOINTS.auth.me
      );
      return response.data;
    },
    enabled,
    retry: false,
  });
};

export const useUsers = (enabled = true) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await getApiClient().get<{
        data: Array<{ id: string; name: string; email: string; role: string }>;
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }>(API_ENDPOINTS.users.list);

      // Map API response to User interface
      return response.data.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })) as User[];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// ============ ISSUE QUERIES ============

export const useIssues = (filters?: IssueFilters) => {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: async () => {
      const response = await getApiClient().get<PaginatedResponse<Issue>>(
        API_ENDPOINTS.issues.list,
        { params: filters }
      );
      return response.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useIssueDetail = (issueId: string) => {
  return useQuery({
    queryKey: ['issues', issueId],
    queryFn: async () => {
      const response = await getApiClient().get<Issue>(
        API_ENDPOINTS.issues.update(issueId)
      );
      return response.data;
    },
    enabled: !!issueId,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: IssueFormData) => {
      const response = await getApiClient().post<Issue>(
        API_ENDPOINTS.issues.create,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<IssueFormData>;
    }) => {
      const response = await getApiClient().put<Issue>(
        API_ENDPOINTS.issues.update(id),
        data
      );
      return response.data;
    },
    onSuccess: (issue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.setQueryData(['issues', issue.id], issue);
    },
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: string) => {
      await getApiClient().delete(API_ENDPOINTS.issues.delete(issueId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
};

export const useBulkDeleteIssues = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueIds: string[]) => {
      await Promise.all(
        issueIds.map((id) =>
          getApiClient().delete(API_ENDPOINTS.issues.delete(id))
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
};
