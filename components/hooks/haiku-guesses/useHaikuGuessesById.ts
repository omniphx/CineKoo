import { HaikuGuess } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useHaikuGuessesById(haikuId?: number) {
  return useQuery<HaikuGuess[]>({
    queryKey: ["haikus", "guesses", haikuId],
    queryFn: async () => {
      const response = await fetch(`/api/haiku-guesses/${haikuId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch haiku guesses");
      }

      return response.json();
    },
    enabled: !!haikuId,
  });
}

export function useHaikuGuessesAll() {
  return useQuery<HaikuGuess[]>({
    queryKey: ["haikus", "guesses"],
    queryFn: () => fetch(`/api/haiku-stats`).then((res) => res.json()),
  });
}
