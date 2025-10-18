// src/app/api/register/route.ts
     import { connectToDatabase } from '@/lib/mongodb';
     import User from '@/models/User';
     import bcrypt from 'bcryptjs';
     import { NextResponse } from 'next/server';

     export async function POST(request: Request) {
       try {
         const { name, email, password } = await request.json();
         if (!name || !email || !password) {
           return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
         }
         await connectToDatabase();
         const existingUser = await User.findOne({ email });
         if (existingUser) {
           return NextResponse.json({ error: 'User already exists' }, { status: 400 });
         }
         const hashedPassword = await bcrypt.hash(password, 10);
         const user = new User({ name, email, password: hashedPassword });
         await user.save();
         return NextResponse.json({ message: 'User created' }, { status: 201 });
       } catch (error:unknown) {
        console.error('Signup error:', error); // Logs to Vercel for debugging
         return NextResponse.json({ error: 'Server error' }, { status: 500 });
       }
     }