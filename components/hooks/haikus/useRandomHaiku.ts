import { useGameStore } from "@/lib/store";
import { useHaikus } from "./useHaikus";

export function useRandomHaiku() {
  const games = useGameStore((state) => state.games);

  const { data: haikus } = useHaikus();

  const getRandomUnplayedHaiku = () => {
    if (!haikus) return null;

    // Filter out haikus that have been played (have game state and are complete)
    const unplayedHaikus = haikus.filter(
      (haiku) => !games[haiku.movie_id]?.gameOver
    );

    if (unplayedHaikus.length === 0) return null;

    // Select a random haiku from unplayed ones
    const randomIndex = Math.floor(Math.random() * unplayedHaikus.length);
    return unplayedHaikus[randomIndex];
  };

  return { getRandomUnplayedHaiku };
}
