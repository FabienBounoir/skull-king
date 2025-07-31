export const totalCards = 75;

export function calculeMaxRound(usersCount, totalRound = 10) {
    for (let round = 0; round <= totalRound; round++) {
        if (usersCount * round > totalCards) {
            return round - 1;
        }
    }

    return totalRound;
}

export function calculeRoundPoints(player, roundId, allPlayersInRound = []) {
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

    // Calcul des points d'alliance avec vérification des partenaires
    if (player.alliances && player.alliances.length > 0 && allPlayersInRound.length > 0) {
        // Vérifier si ce joueur a réussi son pari
        const playerSuccessfulBet = player.winTurn === player.betTurn;

        if (playerSuccessfulBet) {
            let validAlliances = 0;

            // Vérifier chaque alliance individuellement
            for (const allyName of player.alliances) {
                const ally = allPlayersInRound.find(p => p.player === allyName);

                // Si l'allié existe et a réussi son pari, cette alliance compte
                if (ally && ally.winTurn === ally.betTurn) {
                    validAlliances++;
                }
            }

            roundScore += validAlliances * 20;
        }
        // Si le joueur a échoué son pari, il ne reçoit aucun point d'alliance
    }

    if (player.bonus > 0) {
        roundScore += player.bonus;
    }

    if (player.rascal > 0) {
        roundScore += player.rascal;
    }

    return roundScore;
}