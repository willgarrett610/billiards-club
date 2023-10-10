import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismadb';

type GameTypeNum = {
    id: number;
    name: string;
};

type Data = {
    gameTypes: GameTypeNum[] | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const gameTypes = await prisma.gameType.findMany();

    const gameTypesNums = gameTypes.map((gameType) => ({
        ...gameType,
        id: Number(gameType.id),
    }));

    res.status(200).json({ gameTypes: gameTypesNums });
}
