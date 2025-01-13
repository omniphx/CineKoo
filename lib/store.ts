import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/lib/schemas";

interface GameState {
  // Track game states by movie ID
  games: Record<
    number,
    {
      attempts: number;
      gameOver: boolean;
      result: string | undefined;
      selection: Movie | undefined;
      guess: string;
    }
  >;
  setGuess: (movieId: number, guess: string) => void;
  setSelection: (movieId: number, movie: Movie | undefined) => void;
  submitGuess: (movieId: number, correctMovieId: number) => void;
  resetGame: (movieId: number) => void;
  // Helper to get current game state
  getGameState: (movieId: number) => {
    attempts: number;
    gameOver: boolean;
    result: string | undefined;
    selection: Movie | undefined;
    guess: string;
  };
}

const initialGameState = {
  attempts: 0,
  gameOver: false,
  result: undefined,
  selection: undefined,
  guess: "",
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      games: {},

      getGameState: (movieId) => {
        const state = get();
        return state.games[movieId] || initialGameState;
      },

      setGuess: (movieId, guess) =>
        set((state) => ({
          games: {
            ...state.games,
            [movieId]: {
              ...(state.games[movieId] || initialGameState),
              guess,
            },
          },
        })),

      setSelection: (movieId, movie) =>
        set((state) => ({
          games: {
            ...state.games,
            [movieId]: {
              ...(state.games[movieId] || initialGameState),
              selection: movie,
            },
          },
        })),

      submitGuess: (movieId, correctMovieId) =>
        set((state) => {
          const currentGame = state.games[movieId] || initialGameState;
          const newAttempts = currentGame.attempts + 1;
          const MAX_ATTEMPTS = 3;

          if (currentGame.selection?.id === correctMovieId) {
            return {
              games: {
                ...state.games,
                [movieId]: {
                  ...currentGame,
                  attempts: newAttempts,
                  result: "Correct! Well done! 🎉",
                  gameOver: true,
                  guess: "",
                  selection: undefined,
                },
              },
            };
          }

          if (newAttempts >= MAX_ATTEMPTS) {
            return {
              games: {
                ...state.games,
                [movieId]: {
                  ...currentGame,
                  attempts: newAttempts,
                  result: "Game Over!",
                  gameOver: true,
                  guess: "",
                  selection: undefined,
                },
              },
            };
          }

          return {
            games: {
              ...state.games,
              [movieId]: {
                ...currentGame,
                attempts: newAttempts,
                result: `Sorry, that's not correct. ${
                  MAX_ATTEMPTS - newAttempts
                } ${
                  MAX_ATTEMPTS - newAttempts === 1 ? "try" : "tries"
                } remaining.`,
                guess: "",
                selection: undefined,
              },
            },
          };
        }),

      resetGame: (movieId) =>
        set((state) => ({
          games: {
            ...state.games,
            [movieId]: initialGameState,
          },
        })),
    }),
    {
      name: "movie-haiku-storage",
      // Only persist specific fields from the games objects
      partialize: (state) => ({
        games: Object.fromEntries(
          Object.entries(state.games).map(([key, game]) => [
            key,
            {
              attempts: game.attempts,
              gameOver: game.gameOver,
              result: game.result,
            },
          ])
        ),
      }),
    }
  )
);

export const useMovieGame = (movieId: number) => {
  const gameState = useGameStore((state) => state.getGameState(movieId));
  const store = useGameStore();

  return {
    ...gameState,
    setGuess: (guess: string) => store.setGuess(movieId, guess),
    setSelection: (movie: Movie | undefined) =>
      store.setSelection(movieId, movie),
    submitGuess: (correctMovieId: number) =>
      store.submitGuess(movieId, correctMovieId),
    resetGame: () => store.resetGame(movieId),
  };
};
