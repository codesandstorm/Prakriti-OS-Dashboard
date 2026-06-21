import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from './useStore';
import { apiClient } from '../services/apiClient';
import type { OfficerTask, AuditTrailLog } from '../types';

export const useOfficersQuery = () => {
  return useQuery({
    queryKey: ['officers'],
    queryFn: async () => {
      return apiClient.get<any[]>('/api/officers');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000
  });
};

export const useIncidentsQuery = () => {
  const isOnline = useStore(state => state.isOnline);
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      return apiClient.get<any[]>('/api/incidents');
    },
    refetchInterval: isOnline ? 15000 : false, // background poll every 15s when online
    staleTime: 10000
  });
};

export const useAssignTaskMutation = () => {
  const queryClient = useQueryClient();
  const { addOfficerTask, addOfficerAudit } = useStore.getState();

  return useMutation({
    mutationFn: async (task: OfficerTask) => {
      return apiClient.post<OfficerTask>('/api/tasks', task);
    },
    // Optimistic Update
    onMutate: async (newTask) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Save snapshots of previous values
      const previousTasks = queryClient.getQueryData<OfficerTask[]>(['tasks']);

      // Optimistically insert task into client registers
      queryClient.setQueryData<OfficerTask[]>(['tasks'], (old = []) => [...old, newTask]);
      
      // Update local Zustand store optimistically
      addOfficerTask(newTask);

      const newAudit: AuditTrailLog = {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        officerId: newTask.officerId,
        action: 'Task Assigned',
        details: `(Optimistic) Dispatching task: ${newTask.title}`
      };
      addOfficerAudit(newAudit);

      return { previousTasks };
    },
    onError: (err, _newTask, context) => {
      // Rollback to previous state if API call throws error
      console.error("Mutation failed, rolling back task dispatch:", err);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      return apiClient.get<OfficerTask[]>('/api/tasks');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();
  const { updateOfficerTaskStatus, addOfficerAudit } = useStore.getState();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: OfficerTask['status'] }) => {
      // Mimic put update
      return apiClient.put<{ success: boolean }>('/api/tasks/status', { taskId, status });
    },
    // Optimistic Update
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<OfficerTask[]>(['tasks']);

      // Optimistically update
      queryClient.setQueryData<OfficerTask[]>(['tasks'], (old = []) => 
        old.map(t => t.id === taskId ? { ...t, status } : t)
      );

      updateOfficerTaskStatus(taskId, status);

      const targetTask = useStore.getState().officerTasks.find(t => t.id === taskId);
      const newAudit: AuditTrailLog = {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        officerId: targetTask?.officerId || '',
        action: `Status: ${status}`,
        details: `(Optimistic) Marked task "${targetTask?.title}" as ${status}.`
      };
      addOfficerAudit(newAudit);

      return { previousTasks };
    },
    onError: (err, _variables, context) => {
      console.error("Mutation status update failed, rolling back:", err);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};
export default useOfficersQuery;
