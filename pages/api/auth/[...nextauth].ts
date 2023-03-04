import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import { Generator } from "snowflake-generator";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    session: async ({ session, user }) => {
      (session as any).user.admin = (user as any).admin;
      return Promise.resolve(session);
    },
  },
  events: {
    async createUser({ user }) {
      console.log("Create User: " + user.name);
      if (!user.email || !user.name) return;

      const count = await prisma.player.count({
        where: {
          email: user.email,
        },
      });

      console.log("Matching players: " + count);

      if (count > 0) return;

      console.log("Creating player...");
      await prisma.player.create({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    },
  },
};

export default NextAuth(authOptions);
