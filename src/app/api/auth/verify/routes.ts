import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, token } = await req.json();
    
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      verificationToken: token 
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
    }
    
    if (user.isVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}