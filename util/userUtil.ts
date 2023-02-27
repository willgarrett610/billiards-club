import { Session } from "next-auth";
import prisma from "@/lib/prismadb";

export const getUserFromSession = async (session: Session | null) => {
  if (!session?.user?.email) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      player: true,
    },
  });

  return user;
};
