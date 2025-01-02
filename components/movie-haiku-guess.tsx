"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const movieHaiku = {
  haiku: `Dreaming in layers,\nMind's architecture bends time,\nReality blurs.`,
  movie: "Inception",
};

export function MovieHaikuGuess() {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [showHaiku, setShowHaiku] = useState(false);

  useEffect(() => {
    setShowHaiku(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toLowerCase() === movieHaiku.movie.toLowerCase()) {
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
        <CardContent className="p-4 sm:p-6">
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
              {movieHaiku.haiku.split("\n").map((line, index) => (
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
            <Input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
              className="w-full text-base sm:text-lg border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 p-2 sm:p-3"
            />
            <Button
              type="submit"
              className="w-full text-base sm:text-lg py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              Submit Guess 🎬
            </Button>
          </form>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 sm:mt-4 text-center text-base sm:text-lg font-semibold text-gray-600`}
            >
              {result}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
