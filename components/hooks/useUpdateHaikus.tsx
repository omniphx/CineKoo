// hooks/mutations/useUpdateHaiku.ts
import { Haiku } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateHaiku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (haiku: Haiku) => {
      const response = await fetch("/api/haikus", {
        method: "PUT",
        body: JSON.stringify(haiku),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update haiku");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haikus"] });
    },
  });
}
