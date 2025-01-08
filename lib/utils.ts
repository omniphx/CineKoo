import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Movie } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePrompt(movie: Movie) {
  return `You are responsible for generating haikus that describe movies.
These will be used by human players to guess the title movies.
Haikus you create must not include the movie title or actor names in the film.
They should strive to make guessing the movie name a reasonable challenge.
Write a haiku about ${movie.title}.
`;
}
