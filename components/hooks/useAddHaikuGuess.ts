import { useMutation, useQueryClient } from "@tanstack/react-query";

interface HaikuGuessPayload {
  haikuId: number;
  guess: string;
}

interface HaikuGuessResponse {
  correct: boolean;
  message?: string;
}

export function useAddHaikuGuess() {
  const queryClient = useQueryClient();

  return useMutation<HaikuGuessResponse, Error, HaikuGuessPayload>({
    mutationFn: async ({ haikuId, guess }) => {
      const response = await fetch("/api/haiku-guesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ haikuId, guess }),
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
