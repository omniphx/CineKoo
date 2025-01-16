import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json(
      { error: "Haiku ID is required" },
      { status: 400 }
    );
  }

  try {
    const stats = await prisma.haikuStats.findUnique({
      where: {
        haikuId: parseInt(params.id),
      },
    });

    return NextResponse.json(stats);
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
    const { haikuId, tryNumber, isCorrect } = body;

    if (!haikuId || !tryNumber || ![1, 2, 3].includes(tryNumber)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Find or create stats record
    let stats = await prisma.haikuStats.findUnique({
      where: { haikuId },
    });

    if (!stats) {
      // Create new stats record if it doesn't exist
      stats = await prisma.haikuStats.create({
        data: { haikuId },
      });
    }

    // Update the appropriate counter based on tryNumber
    const updateData = {
      firstTryCount:
        isCorrect && tryNumber === 1
          ? stats.firstTryCount + 1
          : stats.firstTryCount,
      secondTryCount:
        isCorrect && tryNumber === 2
          ? stats.secondTryCount + 1
          : stats.secondTryCount,
      thirdTryCount:
        isCorrect && tryNumber === 3
          ? stats.thirdTryCount + 1
          : stats.thirdTryCount,
      gameOverCount:
        !isCorrect && tryNumber === 4
          ? stats.gameOverCount + 1
          : stats.gameOverCount,
      tryCount: stats.tryCount + 1,
    };

    const updatedStats = await prisma.haikuStats.update({
      where: { haikuId },
      data: updateData,
    });

    return NextResponse.json(updatedStats);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
