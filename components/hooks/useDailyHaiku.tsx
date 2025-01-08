import { Haiku } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useDailyHaiku() {
  return useQuery<Haiku>({
    queryKey: ["haikus"],
    queryFn: () => fetch("/api/haikus/daily").then((res) => res.json()),
  });
}
