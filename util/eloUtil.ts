const getEffN = (rating: number): number =>
    50 / Math.sqrt(0.662 + 0.00000739 * (2569 - rating) ** 2);

export const getNewEloScores = (
    elo1: number,
    elo2: number,
    score1: number,
    score2: number,
): [number, number] => {
    const k1 = 800 / (getEffN(elo1) + 1);
    const k2 = 800 / (getEffN(elo2) + 1);

    const prob1 = 1 / (1 + 10 ** ((elo2 - elo1) / 400));
    const prob2 = 1 / (1 + 10 ** ((elo1 - elo2) / 400));

    const totalScore = score1 + score2;

    let newElo1 = Math.round(elo1 + k1 * (score1 / totalScore - prob1));
    let newElo2 = Math.round(elo2 + k2 * (score2 / totalScore - prob2));

    if (newElo1 < 100) newElo1 = 100;
    if (newElo2 < 100) newElo2 = 100;

    return [newElo1, newElo2];
};
