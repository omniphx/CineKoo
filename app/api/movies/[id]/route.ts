import { NextResponse } from "next/server";
import { MovieDetailsSchema } from "@/lib/schemas";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const rawData = await response.json();
    const data = MovieDetailsSchema.parse(rawData);

    return Response.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
