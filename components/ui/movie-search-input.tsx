"use client";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";
import { Movie } from "@/lib/schemas";

interface MovieSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (movie: Movie) => void;
  placeholder?: string;
}

export function MovieSearchInput({
  value,
  onChange,
  onSelect,
  placeholder = "Search for a movie...",
}: MovieSearchInputProps) {
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

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full text-base sm:text-lg border-2 border-purple-300 focus:border-purple-500 focus:ring-blue-500 p-2 sm:p-3"
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-3"
              onClick={() => {
                onChange(suggestion.title);
                onSelect?.(suggestion);
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
                {suggestion.title} ({suggestion.release_date.substring(0, 4)})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
