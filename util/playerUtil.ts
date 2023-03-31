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

export type Ranking = {
    name: string;
    elo: number;
};

export const getRankings = async (): Promise<Ranking[]> => {
    if (!process.browser) {
        throw new Error('getRankings can only be called on the client');
    }

    const res = await fetch('http://' + window.location.host + '/api/get_rankings');
    const data = (await res.json()) as unknown;
    if (
        typeof data !== 'object' ||
        data === null ||
        !('rankings' in data) ||
        !Array.isArray(data.rankings)
    ) {
        throw new Error('Invalid ranking data');
    }
    if (!data.rankings.every((ranking: unknown) => isRanking(ranking))) {
        throw new Error('Invalid ranking data');
    }
    return data.rankings as Ranking[];
}

export const isPlayer = (possiblePlayer: unknown): possiblePlayer is Player => {
    if (typeof possiblePlayer !== 'object') return false;
    if (possiblePlayer === null) return false;
    if (typeof (possiblePlayer as Player).email !== 'string') return false;
    if (typeof (possiblePlayer as Player).name !== 'string') return false;
    return true;
};

export const isRanking = (possibleRanking: unknown): possibleRanking is Ranking => {
    if (typeof possibleRanking !== 'object') return false;
    if (possibleRanking === null) return false;
    if (typeof (possibleRanking as Ranking).name !== 'string') return false;
    if (typeof (possibleRanking as Ranking).elo !== 'number') return false;
    return true;
};
