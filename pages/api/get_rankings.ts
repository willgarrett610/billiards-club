import { getUserFromSession } from '@/util/userUtil';
import { Player } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prismadb';

type DataRow = {
  name: string;
  elo: number;
}

type Data = {
  rankings: DataRow[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const rankings = await prisma.player.findMany({
    select: {
      'name': true,
      'elo': true
    },
    orderBy: {
      'elo': 'desc'
    }
  });

  res.status(200).json({ rankings });
}
