import { HaikuGuess } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useHaikuGuesses() {
  return useQuery<HaikuGuess[]>({
    queryKey: ["haikus", "guesses"],
    queryFn: () => fetch(`/api/haiku-stats`).then((res) => res.json()),
  });
}
