import { HaikuStats } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useHaikuStats() {
  return useQuery<HaikuStats[]>({
    queryKey: ["haikus", "stats"],
    queryFn: () => fetch(`/api/haiku-stats`).then((res) => res.json()),
    initialData: [],
  });
}
