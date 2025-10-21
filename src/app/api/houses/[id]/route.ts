// src/app/api/houses/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import House from "@/models/House";

/**
 * GET /api/houses/[id]
 * Fetch a single house by ID
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const house = await House.findById(id);
    if (!house) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json(house, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching house:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/houses/[id]
 * Optional: For deleting a house by ID (only for agents or admins)
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const deleted = await House.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "House not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "House deleted successfully" }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting house:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
