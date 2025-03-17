import { Player } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getPlayers = async (): Promise<Player[]> => {
    if (typeof window === 'undefined') {
        // TODO: Return from database directly??
        console.warn('getPlayers can only be called on the client');
        return [];
    }

    return axios.get('/api/get_players').then((res) => res.data.players);
};

export const useGetPlayers = () => useQuery(['getPlayers'], getPlayers);

export type Ranking = {
    rank: number;
    name: string;
    elo: number;
};

const getRankings = async (): Promise<Ranking[]> => {
    if (typeof window === 'undefined') {
        console.warn('getRankings can only be called on the client');
        return [];
    }

    return axios.get('/api/get_rankings').then((res) => res.data.rankings);
};

export const useGetRankings = () => useQuery(['getRankings'], getRankings);

export type CreatePlayerVars = {
    name: string;
    email: string;
};

const createPlayer = (vars: CreatePlayerVars) =>
    axios.post('/api/create_player', vars).then((res) => res.data);

export const useCreatePlayer = () => {
    return useMutation({
        mutationFn: createPlayer,
    });
};
