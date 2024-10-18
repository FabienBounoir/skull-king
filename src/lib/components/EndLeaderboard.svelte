<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let players = [];
	export let rounds = [];
	export let selectedRound = 0;

	let scores = new Map();
	let scoreArray = [];
	let top = {
		0: '🥇',
		1: '🥈',
		2: '🥉'
	};

	const calculateScores = () => {
		for (let i = 0; i < rounds.length; i++) {
			let round = rounds[i];
			for (let player of round) {
				if (!scores.has(player.player)) {
					scores.set(player.player, 0);
				}

				if (player.custom > 0) {
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

		scoreArray = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
	};

	onMount(() => {
		calculateScores();
	});
</script>

<main class="end-leaderboard">
	<h1>Partie terminée</h1>
	<h2>Classement</h2>
	<div class="players">
		{#each scoreArray as [player, score], index}
			<div
				class:top1={index === 0}
				class:top2={index === 1}
				class:top3={index === 2}
				class="player"
				class:bold={index < 3}
			>
				<p>
					<span>{top[index] || index + 1}</span>{player}
				</p>
				<p class:negative={score < 0}>{score} pts</p>
			</div>
		{/each}
	</div>

	<button
		on:click={() => {
			goto('/');
		}}>Nouvelle partie</button
	>
</main>

<style lang="scss">
	.end-leaderboard {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 10px;

		h1 {
			color: var(--primary-950);
		}

		h2 {
			color: var(--primary-950);
		}
	}

	.end-leaderboard p {
		margin: 0;
		display: flex;
		flex-direction: row;
		gap: 5px;

		&.negative {
			color: red;
		}

		span {
			width: 30px;
			align-items: center;
			display: flex;
			justify-content: center;
			font-weight: bold;
		}
	}

	.end-leaderboard .players {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}

	.bold {
		font-weight: bold;
	}

	.top1 {
		background-color: var(--primary-800) !important;
		color: white;
	}

	.top2 {
		background-color: var(--primary-600) !important;
		color: white;
	}

	.top3 {
		background-color: var(--primary-400) !important;
		color: white;
	}

	.end-leaderboard .player {
		justify-content: space-between;
		display: flex;
		width: 90vw;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		text-transform: uppercase;

		padding: 10px 10px;
		background-color: var(--primary-200);
		border-radius: 5px;
	}

	.end-leaderboard .player.selected {
		background-color: red;
		color: white;
		font-weight: bold;
	}

	.end-leaderboard button {
		position: fixed;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		background-color: var(--primary-500);
		color: var(--primary-50);
		cursor: pointer;
		width: 90vw;
	}
</style>
