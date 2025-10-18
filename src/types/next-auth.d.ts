import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: "student" | "agent" | "admin";
  }

  interface Session {
    user?: User;
  }
}
