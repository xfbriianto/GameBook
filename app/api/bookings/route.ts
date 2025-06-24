import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Ambil semua bookings
export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      station: true,
      user: true,
    },
  });
  return NextResponse.json({ success: true, data: bookings });
}

// POST: Tambah booking baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking = await prisma.booking.create({ data: body });
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// PATCH: Update booking
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const booking = await prisma.booking.update({
    where: { id: body.id },
    data: body,
  });
  return NextResponse.json({ success: true, data: booking });
}

// DELETE: Hapus booking
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
