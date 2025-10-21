import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import House from '@/models/House';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newHouse = await House.create(body);
    return NextResponse.json(newHouse, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
