<script>
	import { afterUpdate, onMount } from 'svelte';

	export let players = [];
	export let rounds = [];
	export let selectedRound = 0;
	export let actualScore = [];
	export let status;

	let scores = new Map();
	let bestScore = 0;

	const calculateScores = () => {
		bestScore = 0;
		scores.clear();

		for (let player of players) {
			console.log('    > PLAYER', player);
			if (!scores.has(player)) {
				scores.set(player, 0);
			}
		}

		actualScore = Array.from(scores.entries());

		for (let i = 0; i < rounds.length; i++) {
			if (i >= selectedRound) {
				break;
			}

			let round = rounds[i];
			for (let player of round) {
				if (!scores.has(player.player)) {
					scores.set(player.player, 0);
				}

				if (player.custom) {
					scores.set(player.player, scores.get(player.player) + player.custom);
					continue;
				}

				let score = 0;
				// player lose the bet
				if (player.winTurn != player.betTurn) {
					if (player.betTurn === 0) {
						score -= (i + 1) * 10;
					} else {
						score -= Math.abs(player.winTurn - player.betTurn) * 10;
					}

					if (player.rascal > 0) {
						score -= player.rascal;
					}

					console.log('    > SCORE NEGATIF', score, scores.get(player.player));

					scores.set(player.player, scores.get(player.player) + score);

					continue;
				}

				if (player.winTurn === player.betTurn && player.winTurn > 0) {
					score += player.winTurn * 20;
				} else if (player.winTurn == 0 && player.betTurn == 0) {
					score += (i + 1) * 10;
				}

				// player capture pirate with the skull king
				if (player.capturePirate > 0) {
					score += player.capturePirate * 30;
				}

				// player capture sirene with pirate
				if (player.captureSirene > 0) {
					score += player.captureSirene * 20;
				}

				// player capture skull king with sirene
				if (player.captureSkullKing > 0) {
					score += player.captureSkullKing * 40;
				}

				if (player.alliance > 0) {
					score += player.alliance * 20;
				}

				if (player.bonus > 0) {
					score += player.bonus;
				}

				if (player.rascal > 0) {
					score += player.rascal;
				}

				scores.set(player.player, scores.get(player.player) + score);
			}
		}

		actualScore = Array.from(scores.entries());
		setBestScore();
	};

	const setBestScore = () => {
		bestScore = Array.from(scores.values()).reduce((a, b) => Math.max(a, b));
	};

	onMount(() => {
		calculateScores();
	});
</script>

<main
	class="leaderboard"
	on:click={() => {
		status = 'LEADERBOARD';
	}}
>
	<h1>Score Board</h1>
	<div class="players">
		{#each actualScore as [player, score], index}
			<div class="player" class:selected={index == selectedRound % players.length}>
				<p>{bestScore == score ? '🏆 ' : ''}{player}: {score}</p>
			</div>
		{/each}
	</div>
</main>

<style>
	.leaderboard {
		border: 5px solid var(--primary-800);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 0 10px 10px 10px;
		background-color: var(--primary-200);
		cursor: pointer;
	}

	.leaderboard p {
		margin: 0;
		letter-spacing: 2px;
	}

	.leaderboard h1 {
		margin: 0;
		text-align: center;
		color: var(--primary-950);
	}

	.leaderboard .players {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}

	.leaderboard .player {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		justify-content: center;
		padding: 3px 10px;
		background-color: var(--primary-100);
		color: var(--primary-400);
		border-radius: 5px;
		text-transform: uppercase;
	}

	.leaderboard .player.selected {
		background-color: var(--primary-700);
		font-weight: bold;
		color: white;
		font-weight: bold;
		animation: blinker 1s linear alternate infinite;
	}

	@keyframes blinker {
		20% {
			filter: brightness(1.5);
		}

		50% {
			filter: brightness(1);
		}
	}
</style>
