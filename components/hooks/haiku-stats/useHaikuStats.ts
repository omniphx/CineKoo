import { HaikuStats } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useHaikuStats(haikuId: number) {
  return useQuery<HaikuStats[]>({
    queryKey: ["haikus", "stats", haikuId],
    queryFn: () =>
      fetch(`/api/haikus-stats/${haikuId}`).then((res) => res.json()),
  });
}
