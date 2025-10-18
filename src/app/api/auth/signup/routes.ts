import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs'; 

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, role } = await request.json();
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    
    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password, 
      role 
    });
    
    const verificationToken = user.generateVerificationToken();
    await user.save();

    user.isVerified = true; // Auto-verify for testing
await user.save();

    // Email verification (configure SMTP later)
    // await sendVerificationEmail(email, verificationToken);
    
    console.log(`Verification token for ${email}: ${verificationToken}`); // For testing
    
    return NextResponse.json({ 
      success: true, 
      message: 'User created. Check console for verification token or implement email.',
      verificationToken // Remove in production
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}