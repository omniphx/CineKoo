import { PrismaClient } from "@prisma/client";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
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
  } catch (error: unknown) {
    return handleError(error);
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
    return handleError(error);
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
    return handleError(error);
  }
}

function handleError(error: unknown) {
  console.error(error);

  if (
    error instanceof PrismaClientValidationError ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientKnownRequestError ||
    error instanceof Error
  ) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Failed" }, { status: 500 });
}
