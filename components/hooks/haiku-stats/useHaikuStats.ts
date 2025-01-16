import { HaikuStats } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useHaikuStats(haikuId?: number) {
  return useQuery<HaikuStats | null>({
    queryKey: ["haikus", "stats", haikuId],
    queryFn: () =>
      fetch(`/api/haiku-stats/${haikuId}`).then((res) => res.json()),
    enabled: !!haikuId,
  });
}
