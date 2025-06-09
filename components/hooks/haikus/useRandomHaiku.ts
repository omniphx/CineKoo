import { useGameStore } from "@/lib/store";
import { useHaikus } from "./useHaikus";

export function useRandomHaiku() {
  const games = useGameStore((state) => state.games);

  const { data: haikus } = useHaikus();

  const getRandomUnplayedHaiku = () => {
    if (!haikus) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Filter out haikus that have been played (have game state and are complete)
    // and only include past haikus (date < today)
    const unplayedHaikus = haikus.filter(
      (haiku) => !games[haiku.movie_id]?.gameOver && new Date(haiku.date) < today
    );

    if (unplayedHaikus.length === 0) return null;

    // Select a random haiku from unplayed ones
    const randomIndex = Math.floor(Math.random() * unplayedHaikus.length);
    return unplayedHaikus[randomIndex];
  };

  const getUnplayedHaikusCount = () => {
    if (!haikus) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const unplayedHaikus = haikus.filter(
      (haiku) => !games[haiku.movie_id]?.gameOver && new Date(haiku.date) < today
    );
    
    return unplayedHaikus.length;
  };

  return { getRandomUnplayedHaiku, getUnplayedHaikusCount };
}
