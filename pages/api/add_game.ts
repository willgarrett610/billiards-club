// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prismadb";
import { PrismaClient } from "@prisma/client";
import { Generator } from "snowflake-generator";

type Data = {
  success: boolean;
  error: string | null;
  id: string | null;
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

type EloData = {
  elo: number;
  game_count: bigint;
};

const getEloData = async (email: string) => {
  const eloData1 =
    (await prisma.$queryRaw`SELECT new_elo as elo, game_count FROM 
  (SELECT player_id, new_elo FROM \`elo_updates\` WHERE player_id=${email} ORDER BY id DESC LIMIT 1) \`player_elo\`
  INNER JOIN 
  (SELECT player_id, COUNT(player_id) as game_count FROM \`elo_updates\` WHERE player_id=${email}) \`player_count\` 
  ON \`player_elo\`.player_id = \`player_count\`.player_id`) as EloData[];

  var elo: number;
  var game_count: number;

  if (eloData1.length == 0) {
    elo = 800;
    game_count = 0;
  } else {
    elo = eloData1[0].elo;
    game_count = Number(eloData1[0].game_count);
  }

  return { elo, game_count };
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

  const sfGenerator = new Generator();
  const gameId = sfGenerator.generate() as bigint;

  const { elo: elo1, game_count: game_count1 } = await getEloData(
    reqData.email1
  );
  const { elo: elo2, game_count: game_count2 } = await getEloData(
    reqData.email2
  );

  console.log(elo1, game_count1, elo2, game_count2);

  const k1 = 800 / (game_count1 + 1);
  const k2 = 800 / (game_count2 + 1);

  const prob1 = 1 / (1 + 10 ** ((elo2 - elo1) / 400));
  const prob2 = 1 / (1 + 10 ** ((elo1 - elo2) / 400));

  const totalScore = reqData.score1 + reqData.score2;

  const newElo1 = Math.round(elo1 + k1 * (reqData.score1 / totalScore - prob1));
  const newElo2 = Math.round(elo2 + k2 * (reqData.score2 / totalScore - prob2));

  const gameQuery = prisma.game.create({
    data: {
      id: gameId,
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

  const eloUpdate1Query = prisma.eloUpdate.create({
    data: {
      oldElo: elo1,
      newElo: newElo1,
      player: {
        connect: {
          email: reqData.email1,
        },
      },
      game: {
        connect: {
          id: gameId,
        },
      },
    },
  });

  const eloUpdate2Query = prisma.eloUpdate.create({
    data: {
      oldElo: elo2,
      newElo: newElo2,
      player: {
        connect: {
          email: reqData.email2,
        },
      },
      game: {
        connect: {
          id: gameId,
        },
      },
    },
  });

  const [game] = await prisma.$transaction([
    gameQuery,
    eloUpdate1Query,
    eloUpdate2Query,
  ]);

  res.status(200).json({ success: true, error: null, id: game.id.toString() });
}
