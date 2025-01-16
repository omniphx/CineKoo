import { useQuery } from "@tanstack/react-query";
import { MovieDetails } from "@/lib/schemas";

export function useMovieDetails(movieId?: number) {
  return useQuery<MovieDetails>({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const response = await fetch(`/api/movies/${movieId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      return data;
    },
    enabled: !!movieId,
  });
}
