// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prismadb';

type Data = {
    success: boolean;
    error: string | null;
};

type ReqData = {
    name: string;
    email: string;
};

function isReqData(data: unknown): data is ReqData {
    if (typeof data !== 'object' || data === null) return false;
    if ('name' in data && typeof data.name !== 'string') return false;
    if ('email' in data && typeof data.email !== 'string') return false;

    return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session?.user.admin && process.env.NODE_ENV !== 'development') {
        res.status(403).json({ success: false, error: 'Unauthorized' });
        return;
    }

    const reqData = req.body;

    if (!isReqData(reqData)) {
        res.status(400).json({ success: false, error: 'Invalid request' });
        return;
    }

    const playerQuery = prisma.player.create({
        data: {
            name: reqData.name,
            email: reqData.email,
        },
    });

    await prisma.$transaction([playerQuery]);

    res.status(200).json({ success: true, error: null });
}
