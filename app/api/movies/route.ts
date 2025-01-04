import { MovieSearchResponseSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "indiana";

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`,
        accept: " application/json",
      },
    }
  );

  const rawData = await res.json();
  const data = MovieSearchResponseSchema.parse(rawData);

  return Response.json({ data });
}
