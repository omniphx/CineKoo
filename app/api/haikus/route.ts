import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const haikus = await prisma.haiku.findMany();
  return Response.json(haikus);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const haiku = await prisma.haiku.create({
      data: body,
    });
    return NextResponse.json(haiku, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create haiku" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const haiku = await prisma.haiku.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(haiku);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update haiku" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const haiku = await prisma.haiku.delete({
      where: { id },
    });

    return NextResponse.json(haiku);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete haiku" },
      { status: 500 }
    );
  }
}
