import { HaikuStats } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddHaikuStatPayload {
  haikuId: number;
  tryNumber: number;
  isCorrect: boolean;
}

export function useAddHaikuStat() {
  const queryClient = useQueryClient();

  return useMutation<HaikuStats, Error, AddHaikuStatPayload>({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/haiku-stats/${payload.haikuId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add haiku stat");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate the haiku stats query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ["haikus", "stats", variables.haikuId],
      });
    },
  });
}
