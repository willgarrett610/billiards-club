// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prismadb";

type Data = {
  name: string | null | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await prisma.game.create({
    data: {
      id: 1,
      teams: {
        create: [
          {
            id: 1,
            score: 2,
            players: {
              create: [
                {
                  id: 1,
                  player: {
                    connectOrCreate: {
                      where: {
                        email: "william.garrett@student.nmt.edu",
                      },
                      create: {
                        email: "william.garrett@student.nmt.edu",
                        name: "William Garrett",
                      },
                    },
                  },
                },
                {
                  id: 2,
                  player: {
                    connectOrCreate: {
                      where: {
                        email: "jim.johnson@student.nmt.edu",
                      },
                      create: {
                        email: "jim.johnson@student.nmt.edu",
                        name: "Jim Johnson",
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  const session = await unstable_getServerSession(req, res, authOptions);

  if (session == null) {
    res.status(403).json({ name: null });
  } else {
    res.status(200).json({ name: session.user?.name });
  }
}
