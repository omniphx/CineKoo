import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    const guesses = await prisma.haikuGuess.findMany();

    return NextResponse.json(guesses);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
