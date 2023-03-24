import prisma from '@/lib/prismadb';
import { Player } from '@prisma/client';

export const getPlayers = async (): Promise<Player[]> => {
    if (!process.browser) {
        throw new Error('getPlayers can only be called on the client');
    }

    const res = await fetch('http://' + window.location.host + '/api/get_players');
    const data = (await res.json()) as unknown;
    if (
        typeof data !== 'object' ||
        data === null ||
        !('players' in data) ||
        !Array.isArray(data.players)
    ) {
        throw new Error('Invalid player data');
    }
    if (!data.players.every((player: unknown) => isPlayer(player))) {
        throw new Error('Invalid player data');
    }
    return data.players as Player[];
};

export const isPlayer = (possiblePlayer: unknown): possiblePlayer is Player => {
    if (typeof possiblePlayer !== 'object') return false;
    if (possiblePlayer === null) return false;
    if (typeof (possiblePlayer as Player).email !== 'string') return false;
    if (typeof (possiblePlayer as Player).name !== 'string') return false;
    return true;
};
