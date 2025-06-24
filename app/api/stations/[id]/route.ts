import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const station = await prisma.station.findUnique({ where: { id: Number(id) } });
  if (!station) {
    return NextResponse.json({ success: false, error: "Station not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: station });
}
