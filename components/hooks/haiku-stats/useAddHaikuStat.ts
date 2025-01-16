import { HaikuStats } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddHaikuStatPayload {
  haikuId: number;
  tryNumber: 1 | 2 | 3;
}

export function useAddHaikuStat() {
  const queryClient = useQueryClient();

  return useMutation<HaikuStats, Error, AddHaikuStatPayload>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/haiku-stats", {
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
    onSuccess: () => {
      // Invalidate the haiku stats query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["haikuStats"] });
    },
  });
}
