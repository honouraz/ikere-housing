// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "./lib/mongodb";
import User from "./models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const valid = await bcrypt.compare(
          String(credentials.password),
          user.password
        );
        if (!valid) {
          throw new Error("Invalid password");
        }

        // ✅ Minimal, clean return object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "student",
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // 👈 avoids type complaints
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) (session.user as any).id = token.id;
      if (token?.role) (session.user as any).role = token.role;
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
});
