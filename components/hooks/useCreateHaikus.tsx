// hooks/mutations/useCreateHaiku.ts
import { Haiku } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateHaiku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newHaiku: Omit<Haiku, "id">) => {
      const response = await fetch("/api/haikus", {
        method: "POST",
        body: JSON.stringify(newHaiku),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create haiku");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haikus"] });
    },
  });
}
