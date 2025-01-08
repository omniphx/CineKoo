// hooks/mutations/useDeleteHaiku.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteHaiku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetch("/api/haikus", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["haikus"] });
    },
  });
}
