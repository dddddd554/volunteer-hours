import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { ExternalBlob } from "@caffeineai/object-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type AddActivityInput = {
  title: string;
  hours: bigint;
  date: string;
  image: ExternalBlob;
  filename: string;
};

export function useActivities() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActivities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddActivity() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: AddActivityInput) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.addActivity(
        input.title,
        input.hours,
        input.date,
        input.image,
        input.filename,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}
