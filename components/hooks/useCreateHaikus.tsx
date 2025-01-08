// hooks/mutations/useCreateHaiku.ts
import { Haiku } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateHaiku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHaiku: Omit<Haiku, "id">) =>
      fetch("/api/haikus", {
        method: "POST",
        body: JSON.stringify(newHaiku),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haikus"] });
    },
  });
}
