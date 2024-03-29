// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prismadb';
import { Generator } from 'snowflake-generator';
import { getNewEloScores } from '@/util/eloUtil';

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

function isReqData(data: unknown): data is ReqData {
    if (typeof data !== 'object' || data === null) return false;
    if ('player1' in data && typeof data.player1 !== 'string') return false;
    if ('email1' in data && typeof data.email1 !== 'string') return false;
    if ('score1' in data && typeof data.score1 !== 'number') return false;
    if ('player2' in data && typeof data.player2 !== 'string') return false;
    if ('email2' in data && typeof data.email2 !== 'string') return false;
    if ('score2' in data && typeof data.score2 !== 'number') return false;
    if ('game' in data && typeof data.game !== 'number') return false;

    return true;
}

type EloData = {
    elo: number;
    game_count: number;
};

function isEloData(data: unknown): data is EloData {
    if (typeof data !== 'object' || data === null) return false;
    if ('elo' in data && typeof data.elo !== 'number') return false;
    if ('game_count' in data && typeof data.game_count !== 'number') return false;

    return true;
}

const getEloData = async (email: string) => {
    const eloData1 = await prisma.player.findFirst({
        select: {
            elo: true,
            game_count: true,
        },
        where: {
            email,
        },
    });
    //     const eloData1 = await prisma.$queryRaw`SELECT new_elo as elo, game_count FROM
    //   (SELECT player_id, new_elo FROM \`elo_updates\` WHERE player_id=${email} ORDER BY id DESC LIMIT 1) \`player_elo\`
    //   INNER JOIN
    //   (SELECT player_id, COUNT(player_id) as game_count FROM \`elo_updates\` WHERE player_id=${email}) \`player_count\`
    //   ON \`player_elo\`.player_id = \`player_count\`.player_id`;

    let elo: number;
    let game_count: number;

    if (eloData1 === null) {
        elo = 1000;
        game_count = 0;
    } else if (isEloData(eloData1)) {
        const { elo: newElo } = eloData1;
        elo = newElo;
        game_count = Number(eloData1.game_count);
    } else {
        throw new Error('Invalid elo data');
    }

    return { elo, game_count };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session?.user.admin && process.env.NODE_ENV !== 'development') {
        res.status(403).json({ success: false, error: 'Unauthorized', id: null });
        return;
    }

    const reqData = req.body;

    if (!isReqData(reqData)) {
        res.status(400).json({ success: false, error: 'Invalid request', id: null });
        return;
    }

    const sfGenerator = new Generator();
    const gameId = sfGenerator.generate() as bigint;

    const { elo: elo1, game_count: game_count1 } = await getEloData(reqData.email1);
    const { elo: elo2, game_count: game_count2 } = await getEloData(reqData.email2);

    // const k1 = 800 / (game_count1 + 1);
    // const k2 = 800 / (game_count2 + 1);

    // const prob1 = 1 / (1 + 10 ** ((elo2 - elo1) / 400));
    // const prob2 = 1 / (1 + 10 ** ((elo1 - elo2) / 400));

    // const totalScore = reqData.score1 + reqData.score2;

    // const newElo1 = Math.round(elo1 + k1 * (reqData.score1 / totalScore - prob1));
    // const newElo2 = Math.round(elo2 + k2 * (reqData.score2 / totalScore - prob2));

    const [newElo1, newElo2] = getNewEloScores(
        elo1,
        elo2,
        reqData.score1,
        reqData.score2,
    );

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
