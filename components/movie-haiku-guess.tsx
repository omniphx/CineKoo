"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { MovieSearchInput } from "./ui/movie-search-input";
import { useMovieGame } from "@/lib/store";
import { useDailyHaiku } from "./hooks/daily-haiku/useDailyHaiku";
import { useRandomHaiku } from "./hooks/haikus/useRandomHaiku";
import { useAddHaikuGuess } from "./hooks/haiku-guesses/useAddHaikuGuess";
import { useAddHaikuStat } from "./hooks/haiku-stats/useAddHaikuStat";
import { MovieDetails } from "./ui/movie-details";
import { HaikuStatsCard } from "./ui/haiku-stats-card";
import { Haiku } from "@prisma/client";

export function MovieHaikuGuess() {
  const [showHaiku, setShowHaiku] = useState(false);
  const [currentHaiku, setCurrentHaiku] = useState<Haiku | null>(null);
  const [useDaily, setUseDaily] = useState(true);
  
  const { data: todaysHaiku } = useDailyHaiku();
  const { getRandomUnplayedHaiku } = useRandomHaiku();
  
  const activeHaiku = useDaily ? todaysHaiku : currentHaiku;
  const dailyMovieId = activeHaiku?.movie_id || 0;

  const {
    guess,
    selection,
    result,
    gameOver,
    setGuess,
    setSelection,
    submitGuess,
    attempts,
  } = useMovieGame(dailyMovieId);

  const { mutate: addGuess } = useAddHaikuGuess();
  const { mutate: addStat } = useAddHaikuStat();

  useEffect(() => {
    setShowHaiku(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHaiku?.id) return;

    const isCorrect = guess.toLowerCase() === activeHaiku?.title.toLowerCase();

    // Record the guess
    addGuess({
      haikuId: activeHaiku?.id,
      movieId: selection?.id || 0,
      movieTitle: guess,
      isCorrect: isCorrect,
    });

    // Update stats
    addStat({
      haikuId: activeHaiku?.id,
      tryNumber: attempts + 1,
      isCorrect: isCorrect,
    });

    submitGuess(activeHaiku.movie_id);
  };

  const handleTryAnother = () => {
    const randomHaiku = getRandomUnplayedHaiku();
    if (randomHaiku) {
      setCurrentHaiku(randomHaiku);
      setUseDaily(false);
      setShowHaiku(false);
      // Reset the haiku animation
      setTimeout(() => setShowHaiku(true), 100);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-400 via-purple-500 to-red-500">
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-4xl sm:text-5xl font-titan-one text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent p-2">
            ✨ CineKoo ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 sm:pb-6">
          <div className="mb-4 sm:mb-6 text-center">
            <p className="text-base sm:text-lg font-semibold mb-2 text-gray-700">
              Guess the movie based on this haiku...
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showHaiku ? 1 : 0, y: showHaiku ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="italic text-base sm:text-lg"
            >
              {activeHaiku?.body.split("\n").map((line, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.5 }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </motion.div>
          </div>
          {!gameOver ? (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <MovieSearchInput
                value={guess}
                onChange={(value) => setGuess(value)}
                onSelect={(value) => setSelection(value)}
                placeholder="Enter your guess"
              />
              <Button
                type="submit"
                className="w-full text-base sm:text-lg py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                disabled={!selection}
              >
                Submit Guess 🎬
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <MovieDetails todaysHaikuId={activeHaiku?.movie_id} />
              <HaikuStatsCard todaysHaikuId={activeHaiku?.id} />
              <Button
                onClick={handleTryAnother}
                className="w-full text-base sm:text-lg py-2 sm:py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                Try Another Haiku 🎲
              </Button>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mt-3 sm:mt-4 text-center text-base sm:text-lg`}
              >
                {result}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
