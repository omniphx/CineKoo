"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, subMinutes } from "date-fns";
import debounce from "lodash/debounce";
import { Movie } from "@/lib/schemas";

type Haiku = {
  date: string;
  haiku: string;
  movie: string;
};

const defaultHaiku: Haiku = {
  date: "2025-01-02",
  haiku: `Dreaming in layers,\nMind's architecture bends time,\nReality blurs.`,
  movie: "Inception",
};

const dailyHaikus: Haiku[] = [
  defaultHaiku,
  {
    date: "2025-01-03",
    haiku:
      "Chopin's notes resound,\nA soul seeking redemption,\nIn World War's shadows.",
    movie: "The Pianist",
  },
  {
    date: "2025-01-04",
    haiku:
      "Language unlocks peace,\nAliens with circular words,\nPast, present, future.",
    movie: "Arrival",
  },
  {
    date: "2025-01-05",
    haiku:
      "Silent nighttime flights,\nVigilante seeks justice,\nCity's dark savior.",
    movie: "Watchmen",
  },
  {
    date: "2025-01-06",
    haiku:
      "Broken mask reveals,\nA grotesque, fractured being,\nSeeks return to light.",
    movie: "Joker",
  },
  {
    date: "2025-01-07",
    haiku:
      "Survival's new world,\nA post-apocalyptic tale,\nSilent creatures hunt.",
    movie: "A Quiet Place",
  },
  {
    date: "2025-01-08",

    haiku: "Time manipulates,\nRhythmic gunfire in dance,\nA temporal fight.",
    movie: "Tenet",
  },
  {
    date: "2025-01-09",
    haiku:
      "Hidden under snow,\nWestern fear and suspense builds,\nMysteries unravel.",
    movie: "Wind River",
  },
  {
    date: "2025-01-10",
    haiku: "Haunted by old sins,\nIn kitchen's inferno,\nMastery and flaw.",
    movie: "Burnt",
  },
  {
    date: "2025-01-11",
    haiku:
      "Alien shores call,\nMemory’s prison unlocked,\nA lost homeward bound.",
    movie: "Interstellar",
  },
  {
    date: "2025-01-12",
    haiku:
      "Silent and stoic,\nA path to the cold north calls,\nRagnarok awaits.",
    movie: "The Northman",
  },
];

function getTodaysHaiku() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset();
  const localISODate = format(subMinutes(today, timezoneOffset), "yyyy-MM-dd");

  return (
    dailyHaikus.find((haiku) => haiku.date === localISODate) || defaultHaiku
  );
}

export function MovieHaikuGuess() {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [showHaiku, setShowHaiku] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);

  const searchMovies = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/movies?query=${encodeURIComponent(query)}`
      );
      const { data } = await response.json();
      setSuggestions(
        data.results
          .filter(
            (movie: Movie) =>
              movie.popularity > 2 &&
              !!movie.release_date &&
              !!movie.poster_path
          )
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Error searching movies:", error);
      setSuggestions([]);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce(searchMovies, 300),
    [searchMovies]
  );

  const todaysHaiku = getTodaysHaiku();

  useEffect(() => {
    setShowHaiku(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toLowerCase().trim() === todaysHaiku.movie.toLowerCase().trim()) {
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
              {todaysHaiku.haiku.split("\n").map((line, index) => (
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
            <div className="relative">
              <Input
                type="text"
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                placeholder="Enter your guess"
                className="w-full text-base sm:text-lg border-2 border-purple-300 focus:border-purple-500 focus:ring-blue-500 p-2 sm:p-3"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-3"
                      onClick={() => {
                        setGuess(suggestion.title);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                          alt={suggestion.title}
                          className="w-12 h-auto rounded"
                        />
                      )}
                      <span>
                        {suggestion.title} (
                        {suggestion.release_date.substring(0, 4)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              className={`mt-3 sm:mt-4 text-center text-base sm:text-lg`}
            >
              {result}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
