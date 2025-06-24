import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const stations = await prisma.station.findMany();
  return NextResponse.json({ success: true, data: stations });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const station = await prisma.station.create({ data: body });
    return NextResponse.json({ success: true, data: station });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const station = await prisma.station.update({
    where: { id: body.id },
    data: {
      name: body.name,
      type: body.type,
      price: body.price,
      status: body.status,
    },
  });
  return NextResponse.json({ success: true, data: station });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.station.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
