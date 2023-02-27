import { getUserFromSession } from "@/util/userUtil";
import { Player } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prismadb";

type Data = {
  players: Player[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = await getUserFromSession(session);

  console.log(session);
  console.log(user);

  if (user == null || !user.admin) {
    res.status(403).json({ players: null });
  } else {
    const players = await prisma.player.findMany();

    res.status(200).json({ players });
  }
}
