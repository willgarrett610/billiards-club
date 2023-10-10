// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prismadb';
import { Generator } from 'snowflake-generator';

type Data = {
    success: boolean;
    error: string | null;
};

type Game = {
    player1: string;
    score1: number;
    player2: string;
    score2: number;
};

type ReqData = {
    games: Game[];
    gameType: number;
};

function isReqData(data: unknown): data is ReqData {
    console.log('data');
    if (typeof data !== 'object' || data === null) return false;
    console.log('games');
    if (!('games' in data) || typeof data.games !== 'object') return false;
    console.log('gametype');
    if (!('gameType' in data) || typeof data.gameType !== 'number') return false;
    const games = data.games as Array<Game>;
    for (const game of games) {
        console.log('player1');
        if (!('player1' in game) || typeof game.player1 !== 'string') return false;
        console.log('score1');
        if (!('score1' in game) || typeof game.score1 !== 'number') return false;
        console.log('player2');
        if (!('player2' in game) || typeof game.player2 !== 'string') return false;
        console.log('score2');
        if (!('score2' in game) || typeof game.score2 !== 'number') return false;
    }

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

const addGame = async (
    newGame: Game,
    gameType: number,
    eloData: Map<string, EloData>,
) => {
    const sfGenerator = new Generator();
    const gameId = sfGenerator.generate() as bigint;

    const player1EloData = eloData.get(newGame.player1);
    const { elo: elo1, game_count: game_count1 } = player1EloData
        ? player1EloData
        : await getEloData(newGame.player1);

    const player2EloData = eloData.get(newGame.player2);
    const { elo: elo2, game_count: game_count2 } = player2EloData
        ? player2EloData
        : await getEloData(newGame.player2);

    console.log(elo1, game_count1, elo2, game_count2);

    const k1 = 800 / (game_count1 + 1);
    const k2 = 800 / (game_count2 + 1);

    const prob1 = 1 / (1 + 10 ** ((elo2 - elo1) / 400));
    const prob2 = 1 / (1 + 10 ** ((elo1 - elo2) / 400));

    const totalScore = newGame.score1 + newGame.score2;

    const newElo1 = Math.round(elo1 + k1 * (newGame.score1 / totalScore - prob1));
    const newElo2 = Math.round(elo2 + k2 * (newGame.score2 / totalScore - prob2));

    eloData.set(newGame.player1, {
        elo: newElo1,
        game_count: game_count1 + 1,
    });
    eloData.set(newGame.player2, {
        elo: newElo2,
        game_count: game_count2 + 1,
    });

    const gameQuery = prisma.game.create({
        data: {
            id: gameId,
            teams: {
                create: [
                    {
                        score: newGame.score1,
                        players: {
                            create: [
                                {
                                    player: {
                                        connect: {
                                            email: newGame.player1,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        score: newGame.score2,
                        players: {
                            create: [
                                {
                                    player: {
                                        connect: {
                                            email: newGame.player2,
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
                    id: gameType,
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
                    email: newGame.player1,
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
                    email: newGame.player2,
                },
            },
            game: {
                connect: {
                    id: gameId,
                },
            },
        },
    });

    return [gameQuery, eloUpdate1Query, eloUpdate2Query];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session?.user.admin && process.env.NODE_ENV !== 'development') {
        res.status(403).json({ success: false, error: 'Unauthorized' });
        return;
    }

    const reqData = req.body;

    console.log(reqData);

    if (!isReqData(reqData)) {
        res.status(400).json({ success: false, error: 'Invalid request' });
        return;
    }

    const eloData: Map<string, EloData> = new Map<string, EloData>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mutations: any[] = [];

    for (const game of reqData.games) {
        const addGameMutations = await addGame(game, reqData.gameType, eloData);
        mutations = [...mutations, ...addGameMutations];
    }

    await prisma.$transaction(mutations);

    res.status(200).json({ success: true, error: null });
}
