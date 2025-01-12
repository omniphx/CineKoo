import { create } from "zustand";
import { Movie } from "@/lib/schemas";

interface GameState {
  attempts: number;
  gameOver: boolean;
  result: string | undefined;
  selection: Movie | undefined;
  guess: string;
  setGuess: (guess: string) => void;
  setSelection: (movie: Movie | undefined) => void;
  submitGuess: (correctMovieId: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  attempts: 0,
  gameOver: false,
  result: undefined,
  selection: undefined,
  guess: "",

  setGuess: (guess) => set({ guess }),
  setSelection: (movie) => set({ selection: movie }),

  submitGuess: (correctMovieId) =>
    set((state) => {
      const newAttempts = state.attempts + 1;
      const MAX_ATTEMPTS = 3;

      if (state.selection?.id === correctMovieId) {
        return {
          attempts: newAttempts,
          result: "Correct! Well done! 🎉",
          gameOver: true,
          guess: "",
          selection: undefined,
        };
      }

      if (newAttempts >= MAX_ATTEMPTS) {
        return {
          attempts: newAttempts,
          result: "Game Over!",
          gameOver: true,
          guess: "",
          selection: undefined,
        };
      }

      return {
        attempts: newAttempts,
        result: `Sorry, that's not correct. ${MAX_ATTEMPTS - newAttempts} ${
          MAX_ATTEMPTS - newAttempts === 1 ? "try" : "tries"
        } remaining.`,
        guess: "",
        selection: undefined,
      };
    }),

  resetGame: () =>
    set({
      attempts: 0,
      gameOver: false,
      result: undefined,
      selection: undefined,
      guess: "",
    }),
}));
