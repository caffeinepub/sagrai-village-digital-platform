import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CropInput, CropId } from '../backend';

export function useGetAllApprovedCrops() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['approvedCrops'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApprovedCrops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyCrops() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['myCrops'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCrops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCrop() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (crop: CropInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCrop(crop);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedCrops'] });
      queryClient.invalidateQueries({ queryKey: ['myCrops'] });
      queryClient.invalidateQueries({ queryKey: ['allCrops'] });
      queryClient.invalidateQueries({ queryKey: ['pendingCrops'] });
    },
  });
}

export function useEditCrop() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cropId, crop }: { cropId: CropId; crop: CropInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editCrop(cropId, crop);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedCrops'] });
      queryClient.invalidateQueries({ queryKey: ['myCrops'] });
      queryClient.invalidateQueries({ queryKey: ['allCrops'] });
      queryClient.invalidateQueries({ queryKey: ['pendingCrops'] });
    },
  });
}

export function useDeleteCrop() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cropId: CropId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCrop(cropId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedCrops'] });
      queryClient.invalidateQueries({ queryKey: ['myCrops'] });
      queryClient.invalidateQueries({ queryKey: ['allCrops'] });
      queryClient.invalidateQueries({ queryKey: ['pendingCrops'] });
    },
  });
}
