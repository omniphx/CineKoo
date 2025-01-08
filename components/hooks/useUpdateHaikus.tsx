// hooks/mutations/useUpdateHaiku.ts
import { Haiku } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateHaiku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (haiku: Haiku) =>
      fetch("/api/haikus", {
        method: "PUT",
        body: JSON.stringify(haiku),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haikus"] });
    },
  });
}
