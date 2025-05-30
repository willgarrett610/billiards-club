import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismadb';

type DataRow = {
    name: string;
    elo: number;
};

type Data = {
    rankings: DataRow[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rankings = await prisma.player
        .findMany({
            select: {
                name: true,
                elo: true,
            },
            orderBy: {
                elo: 'desc',
            },
        })
        .then((list) => list.map((r, i) => ({ ...r, rank: i + 1 })));

    res.status(200).json({ rankings });
}
