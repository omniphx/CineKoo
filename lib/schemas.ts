import { z } from "zod";

export const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const MovieSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const MovieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().nullable(),
  release_date: z.string().nullable(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
});

// Type inference
export type Movie = z.infer<typeof MovieSchema>;
export type MovieSearchResponse = z.infer<typeof MovieSearchResponseSchema>;
export type MovieDetails = z.infer<typeof MovieDetailsSchema>;
