"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { MovieSearchInput } from "./ui/movie-search-input";
import { useDailyHaiku } from "@/components/hooks/useDailyHaiku";
import { Movie } from "@/lib/schemas";

export function MovieHaikuGuess() {
  const [guess, setGuess] = useState("");
  const [selection, setSelection] = useState<Movie>();
  const [result, setResult] = useState<string>();
  const [showHaiku, setShowHaiku] = useState(false);
  const { data: todaysHaiku } = useDailyHaiku();

  useEffect(() => {
    setShowHaiku(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selection?.id === todaysHaiku?.movie_id) {
      setResult("Correct! Well done! 🎉");
    } else {
      setResult(`Sorry, that's not correct.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-400 via-purple-500 to-red-500">
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent p-2">
            ✨ Reel Haikus ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 sm:pb-6">
          <div className="mb-4 sm:mb-6 text-center">
            <p className="text-base sm:text-lg font-semibold mb-2 text-gray-700">
              Guess the movie based on this haiku:
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showHaiku ? 1 : 0, y: showHaiku ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="italic text-base sm:text-lg"
            >
              {todaysHaiku?.body.split("\n").map((line, index) => (
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
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <MovieSearchInput
              value={guess}
              onChange={(value) => {
                setResult(undefined);
                setGuess(value);
              }}
              onSelect={(value) => setSelection(value)}
              placeholder="Enter your guess"
            />
            <Button
              type="submit"
              className="w-full text-base sm:text-lg py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              Submit Guess 🎬
            </Button>
          </form>
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
