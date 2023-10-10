import { GameType } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type CreateGameVars = {
    player1: string;
    email1: string;
    score1: number;
    player2: string;
    email2: string;
    score2: number;
    game: number;
};

const addGame = (vars: CreateGameVars) =>
    axios.post('/api/add_game', vars).then((res) => res.data);

export const useAddGame = () => {
    return useMutation({
        mutationFn: addGame,
    });
};

export type AddGamesBulkGame = {
    player1: string;
    score1: number;
    player2: string;
    score2: number;
};

export type AddGamesBulkVars = {
    games: AddGamesBulkGame[];
    gameType: number;
};

const addGamesBulk = (vars: AddGamesBulkVars) =>
    axios.post('/api/add_games_bulk', vars).then((res) => res.data);

export const useAddGamesBulk = () => {
    return useMutation({
        mutationFn: addGamesBulk,
    });
};

const getGameTypes = async (): Promise<GameType[]> =>
    axios.post('/api/get_game_types').then((res) => res.data.gameTypes);

export const useGetGameTypes = () => useQuery(['getGameTypes'], getGameTypes);
