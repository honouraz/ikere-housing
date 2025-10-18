// src/app/api/auth/[...nextauth]/route.ts
     import NextAuth, { NextAuthOptions, Session, Token } from 'next-auth';
     import CredentialsProvider from 'next-auth/providers/credentials';
     import { connectToDatabase } from '@/lib/mongodb';
     import User from '@/models/User';
     import bcrypt from 'bcryptjs';

     interface ExtendedToken extends Token {
       id?: string;
     }

     interface ExtendedSession extends Session {
       user: {
         id?: string;
         name?: string | null;
         email?: string | null;
       };
     }

     export const { handlers, auth, signIn, signOut } = NextAuth({
       providers: [
         CredentialsProvider({
           name: 'Credentials',
           credentials: {
             email: { label: 'Email', type: 'email' },
             password: { label: 'Password', type: 'password' },
           },
           async authorize(credentials) {
             if (!credentials?.email || !credentials?.password) {
               throw new Error('Missing credentials');
             }
             await connectToDatabase();
             const user = await User.findOne({ email: credentials.email });
             if (!user || !user.password) {
               throw new Error('No user found or invalid user data');
             }
             const isValid = await bcrypt.compare(String(credentials.password), user.password);
             if (!isValid) {
               throw new Error('Invalid password');
             }
             return { id: user._id.toString(), name: user.name, email: user.email };
           },
         }),
       ],
       pages: {
         signIn: '/login',
       },
       session: {
         strategy: 'jwt',
       },
       callbacks: {
         async jwt({ token, user }: { token: ExtendedToken; user?: { id: string; name?: string; email?: string } }) {
           if (user) {
             token.id = user.id;
           }
           return token;
         },
         async session({ session, token }: { session: ExtendedSession; token: ExtendedToken }) {
           if (token.id) {
             session.user.id = token.id;
           }
           return session;
         },
       },
       debug: true,
     } as NextAuthOptions);

     export const { GET, POST } = handlers;