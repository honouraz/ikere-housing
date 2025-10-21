import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import House from "@/models/House";

/**
 * 🏡 GET /api/houses
 * - If no query → return ALL houses (for students)
 * - If agentId query → return only that agent’s houses
 */
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    const query = agentId ? { agentId } : {};
    const houses = await House.find(query).sort({ createdAt: -1 });

    return NextResponse.json(houses, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching houses:", err);
    return NextResponse.json({ error: "Failed to fetch houses" }, { status: 500 });
  }
}
