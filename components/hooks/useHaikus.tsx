import { Haiku } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useHaikus() {
  return useQuery<Haiku[]>({
    queryKey: ["haikus"],
    queryFn: () => fetch("/api/haikus").then((res) => res.json()),
  });
}
