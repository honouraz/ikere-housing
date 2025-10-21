// src/app/api/chat/messages/route.ts
import { NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "../../auth/config";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import Conversation from "@/models/Conversations";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const session: any = await getServerSession(authOptions);
    const user = session?.data?.user ?? session?.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { conversationId, text } = body as { conversationId?: string; text?: string };

    if (!conversationId || !text) {
      return NextResponse.json({ error: "conversationId and text are required" }, { status: 400 });
    }

    const msg = await Message.create({
      conversationId,
      senderId: user.id,
      text,
    });

    // update conversation lastMessage and updatedAt
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: text }, { new: true });

    return NextResponse.json(msg, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
