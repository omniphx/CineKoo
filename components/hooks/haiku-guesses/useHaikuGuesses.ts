import { useQuery } from "@tanstack/react-query";

interface HaikuGuess {
  id: number;
  haikuId: number;
  guess: string;
  correct: boolean;
  createdAt: string;
  userId: string;
}

interface UseHaikuGuessesOptions {
  haikuId: number;
}

export function useHaikuGuesses({ haikuId }: UseHaikuGuessesOptions) {
  return useQuery<HaikuGuess[]>({
    queryKey: ["haikus", "guesses", haikuId],
    queryFn: async () => {
      const response = await fetch(`/api/haiku-guesses?haikuId=${haikuId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch haiku guesses");
      }

      return response.json();
    },
  });
}
