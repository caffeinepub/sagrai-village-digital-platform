import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NoticeId } from '../backend';

export function useGetAllNotices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, content, postedBy }: { title: string; content: string; postedBy: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNotice(title, content, postedBy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
}

export function useDeleteNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noticeId: NoticeId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNotice(noticeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
}
