import { PrismaClient } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
export const fetchCache = "force-no-store";

const prisma = new PrismaClient();

export const revalidate = 0;

export async function GET() {
  const today = new Date();

  let haiku = await prisma.haiku.findFirst({
    where: {
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
  });

  if (!haiku) {
    haiku = await prisma.haiku.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return Response.json(haiku);
}
