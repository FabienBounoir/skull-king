export const totalCards = 75;

export function calculeMaxRound(usersCount, totalRound = 10) {
    for (let round = 0; round <= totalRound; round++) {
        if (usersCount * round > totalCards) {
            return round - 1;
        }
    }

    return totalRound;
}

export function calculeRoundPoints(player, roundId) {
    if (player.custom) {
        return player.custom;
    }

    let roundScore = 0;

    // player lose the bet
    if (player.winTurn != player.betTurn) {
        if (player.betTurn === 0) {
            roundScore -= (roundId + 1) * 10;
        } else {
            roundScore -= Math.abs(player.winTurn - player.betTurn) * 10;
        }

        if (player.rascal > 0) {
            roundScore -= player.rascal;
        }

        return roundScore;
    }

    // player win the bet
    if (player.winTurn > 0) {
        roundScore += player.winTurn * 20;
    } else {
        roundScore += (roundId + 1) * 10;
    }

    // player capture pirate with the skull king
    if (player.capturePirate > 0) {
        roundScore += player.capturePirate * 30;
    }

    // player capture sirene with pirate
    if (player.captureSirene > 0) {
        roundScore += player.captureSirene * 20;
    }

    // player capture skull king with sirene
    if (player.captureSkullKing > 0) {
        roundScore += player.captureSkullKing * 40;
    }

    if (player.alliance > 0) {
        roundScore += player.alliance * 20;
    }

    if (player.bonus > 0) {
        roundScore += player.bonus;
    }

    if (player.rascal > 0) {
        roundScore += player.rascal;
    }

    return roundScore;
}