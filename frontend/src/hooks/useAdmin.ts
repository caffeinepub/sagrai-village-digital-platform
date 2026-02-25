import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CropId } from '../backend';

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCrops() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allCrops'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCrops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingCrops() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['pendingCrops'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingCrops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveCrop() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cropId: CropId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveCrop(cropId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCrops'] });
      queryClient.invalidateQueries({ queryKey: ['allCrops'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCrops'] });
    },
  });
}

export function useRejectCrop() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cropId: CropId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectCrop(cropId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCrops'] });
      queryClient.invalidateQueries({ queryKey: ['allCrops'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCrops'] });
    },
  });
}

export function useAdminDeleteCrop() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cropId: CropId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCrop(cropId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCrops'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCrops'] });
      queryClient.invalidateQueries({ queryKey: ['pendingCrops'] });
    },
  });
}

export function useGetAllContactInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['contactInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}
