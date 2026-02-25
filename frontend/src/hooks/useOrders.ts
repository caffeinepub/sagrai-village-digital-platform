import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CropId, OrderId, OrderStatus } from '../backend';

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cropId, buyerName, buyerPhone, message }: { cropId: CropId; buyerName: string; buyerPhone: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(cropId, buyerName, buyerPhone, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrdersForMyCrops() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['ordersForMyCrops'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrdersForMycrops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: OrderId; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['ordersForMyCrops'] });
    },
  });
}
