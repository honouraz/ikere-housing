import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversations";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conversations = await Conversation.find({
      participants: session.user.id,
    }).sort({ updatedAt: -1 });

    return NextResponse.json(conversations);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { otherUserId } = await req.json();
    if (!otherUserId) {
      return NextResponse.json({ error: "otherUserId is required" }, { status: 400 });
    }

    const participants = [session.user.id, otherUserId].sort();
    let convo = await Conversation.findOne({ participants });
    if (!convo) {
      convo = await Conversation.create({ participants });
    }

    return NextResponse.json(convo, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
