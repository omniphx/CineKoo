import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const haikuId = searchParams.get("haikuId");

  if (!haikuId) {
    return NextResponse.json(
      { error: "Haiku ID is required" },
      { status: 400 }
    );
  }

  try {
    const guesses = await prisma.haikuGuess.findMany({
      where: {
        haikuId: parseInt(haikuId),
      },
      orderBy: {
        count: "desc",
      },
    });

    return NextResponse.json(guesses);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { haikuId, movieId, movieTitle, isCorrect } = body;

    // Try to find existing guess
    const existingGuess = await prisma.haikuGuess.findUnique({
      where: {
        haikuId_movieId: {
          haikuId,
          movieId,
        },
      },
    });

    if (existingGuess) {
      // Update existing guess count
      const updatedGuess = await prisma.haikuGuess.update({
        where: {
          id: existingGuess.id,
        },
        data: {
          count: existingGuess.count + 1,
        },
      });
      return NextResponse.json(updatedGuess);
    }

    // Create new guess
    const newGuess = await prisma.haikuGuess.create({
      data: {
        haikuId,
        movieId,
        movieTitle,
        isCorrect,
      },
    });

    return NextResponse.json(newGuess);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
