import { HaikuStatsCard } from "./haiku-stats-card";
import { useHaikuStats } from "../hooks/haiku-stats/useHaikuStats";
import { useHaikuGuesses } from "../hooks/haiku-guesses/useHaikuGuesses";
import { useMovieDetails } from "../hooks/movie-details/useMovieDetails";

interface MovieDetailsProps {
  todaysHaikuId?: number;
}

export function MovieDetails({ todaysHaikuId }: MovieDetailsProps) {
  const { data: haikuStats } = useHaikuStats(todaysHaikuId);
  const { data: haikuGuesses } = useHaikuGuesses(todaysHaikuId);
  const { data: movieDetails } = useMovieDetails(todaysHaikuId);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4">
        <div className="flex gap-4">
          {movieDetails?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w92${movieDetails.poster_path}`}
              alt={movieDetails.title}
              className="rounded-lg w-auto h-auto"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {movieDetails?.title}
            </h3>
            <div className="text-sm text-gray-600">
              <p className="mb-1">
                Release Year: {movieDetails?.release_date?.split("-")[0]}
              </p>
              <p className="mb-1">
                Rating: ⭐️ {movieDetails?.vote_average.toFixed(1)}/10
              </p>
              {movieDetails?.overview && (
                <p className="line-clamp-3">{movieDetails.overview}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {haikuStats && haikuGuesses && (
        <HaikuStatsCard
          stats={haikuStats}
          guesses={haikuGuesses}
          totalGuesses={haikuStats.tryCount}
        />
      )}
    </div>
  );
}
