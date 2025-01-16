import { HaikuGuess } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface HaikuGuessPayload {
  haikuId: number;
  movieId: number;
  movieTitle: string;
  isCorrect: boolean;
}

export function useAddHaikuGuess() {
  const queryClient = useQueryClient();

  return useMutation<HaikuGuess, Error, HaikuGuessPayload>({
    mutationFn: async ({ haikuId, movieId, movieTitle, isCorrect }) => {
      const response = await fetch(`/api/haiku-guesses/${haikuId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ haikuId, movieId, movieTitle, isCorrect }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit guess");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["haikus", "guesses", variables.haikuId],
      });
    },
  });
}
