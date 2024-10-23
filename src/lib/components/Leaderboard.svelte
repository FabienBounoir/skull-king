<script>
	import { calculeRoundPoints } from '$lib/utils/functionnality';
	import { afterUpdate, onMount } from 'svelte';

	export let players = [];
	export let rounds = [];
	export let selectedRound = 0;
	export let score = [];
	export let status;

	let usersScore = new Map();
	let bestScore = 0;

	const calculateScores = () => {
		bestScore = 0;
		usersScore.clear();

		for (let player of players) {
			if (!usersScore.has(player)) {
				usersScore.set(player, 0);
			}
		}

		score = Array.from(usersScore.entries());

		for (let i = 0; i < rounds.length; i++) {
			if (i >= selectedRound) {
				break;
			}

			const round = rounds[i];
			for (let player of round) {
				const actualScore = usersScore.get(player.player) || 0;
				const roundScore = calculeRoundPoints(player, i);
				usersScore.set(player.player, actualScore + roundScore);
			}
		}

		score = Array.from(usersScore.entries());
		setBestScore();
	};

	const setBestScore = () => {
		bestScore = Array.from(usersScore.values()).reduce((a, b) => Math.max(a, b));
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
		{#each score as [player, score], index}
			<div class="player" class:selected={index == selectedRound % players.length}>
				<p>{bestScore == score ? '🏆 ' : ''}{player}: {score}</p>
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
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

		.player {
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

			&:not(.selected) {
				p {
					color: var(--primary-800);
				}
			}

			&.selected {
				background-color: var(--primary-700);
				font-weight: bold;
				color: var(--primary-200);
				font-weight: bold;
				animation: blinker 1s linear alternate infinite;
			}
		}
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
