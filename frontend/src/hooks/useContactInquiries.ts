import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSubmitContactInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ name, phone, email, message }: { name: string; phone: string; email: string | null; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactInquiry(name, phone, email, message);
    },
  });
}
