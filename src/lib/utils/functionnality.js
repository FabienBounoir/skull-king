export const totalCards = 75;

export function calculeMaxRound(usersCount, totalRound = 10) {
    for (let round = 0; round <= totalRound; round++) {
        if (usersCount * round > totalCards) {
            return round - 1;
        }
    }

    return totalRound;
}
