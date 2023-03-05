// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prismadb";

type Data = {
  success: boolean;
  error: string | null;
  id: bigint | null;
};

type ReqData = {
  player1: string;
  email1: string;
  score1: number;
  player2: string;
  email2: string;
  score2: number;
  game: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user || !(session.user as any).admin) {
    res.status(403).json({ success: false, error: "Unauthorized", id: null });
    return;
  }

  const reqData = JSON.parse(req.body) as ReqData;

  const game = await prisma.game.create({
    data: {
      teams: {
        create: [
          {
            score: reqData.score1,
            players: {
              create: [
                {
                  player: {
                    connectOrCreate: {
                      where: {
                        email: reqData.email1,
                      },
                      create: {
                        email: reqData.email1,
                        name: reqData.player1,
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            score: reqData.score2,
            players: {
              create: [
                {
                  player: {
                    connectOrCreate: {
                      where: {
                        email: reqData.email2,
                      },
                      create: {
                        email: reqData.email2,
                        name: reqData.player2,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      gameType: {
        connect: {
          id: reqData.game,
        },
      },
    },
  });

  res.status(200).json({ success: true, error: null, id: game.id });
}
