<script>
	import { goto } from '$app/navigation';
	import { api } from '$lib/utils/api';
	import { calculeRoundPoints } from '$lib/utils/functionnality';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { quintOut } from 'svelte/easing';
	import { fade, fly, slide } from 'svelte/transition';

	export let players = [];
	export let rounds;
	export let selectedRound = 0;
	export let status;
	export let totalRound;

	export let idGame = null;

	let scores = [];
	let top = {
		0: '🥇',
		1: '🥈',
		2: '🥉'
	};

	const calculateScores = () => {
		let usersScore = new Map();

		for (let i = 0; i < rounds.length; i++) {
			if (status != 'END' && i == rounds.length - 1) break;
			const round = rounds[i];

			for (const player of round) {
				const actualScore = usersScore.get(player.player) || 0;

				const roundScore = calculeRoundPoints(player, i);
				usersScore.set(player.player, actualScore + roundScore);
			}
		}

		scores = Array.from(usersScore.entries()).sort((a, b) => b[1] - a[1]);
		saveGame(scores);
	};

	function saveGame(score) {
		if (!['END', 'EARLY_END'].includes(status)) return;

		if (idGame) {
			api.put(`/games/${idGame}`, { team: 'soprasteria', score }).then(() => {
				toast.info('Statistiques mises à jour !');
			});
		} else {
			api.post(`/games`, { team: 'soprasteria', score }).then((res) => {
				toast.info('Game saved !');
				idGame = res.insertedId;
			});
		}
	}

	function animate(node, options) {
		if (status === 'END') {
			return options.fn(node, options);
		} else {
			if (options.forceAnimate) {
				options.duration = 300;
				options.delay = 300;
				return options.fn(node, options);
			}
		}
	}

	onMount(() => {
		calculateScores();
	});
</script>

<main
	class="end-leaderboard"
	in:fly={{ duration: 300, easing: quintOut, x: 500 }}
	on:click={() => {
		if (status != 'END' && status != 'EARLY_END') {
			status = 'PLAY';
		}
	}}
>
	{#if status === 'END'}
		<h1>End Game</h1>
	{/if}
	<h2>LeaderBoard</h2>
	<div class="players">
		{#each scores as [player, score], index}
			<div
				class:top1={index === 0}
				class:top2={index === 1}
				class:top3={index === 2}
				class="player"
				class:bold={index < 3}
				transition:animate={{
					fn: fly,
					forceAnimate: false,
					duration: 300,
					easing: quintOut,
					delay: (index + 1) * 200
				}}
			>
				<p>
					<span>{top[index] || index + 1}</span>{player}
				</p>
				<p class:negative={score < 0}>{score} pts</p>
			</div>
		{/each}
		{#if scores.length === 0}
			<h3>No scores found</h3>
		{/if}
	</div>

	<div class="actions" in:animate={{ fn: fade, forceAnimate: true, delay: 700 }}>
		{#if !['END', 'EARLY_END'].includes(status)}
			<button on:click={() => (status = 'PLAY')}>Close</button>
		{:else}
			<button style="transform: rotate(180deg);width: 25%;" on:click={() => (status = 'PLAY')}
				>➜</button
			>

			<button
				on:click={() => {
					goto('/');
				}}>New Game</button
			>
		{/if}
	</div>
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
			color: var(--primary-50);
		}

		h2 {
			color: var(--primary-50);
		}

		h3 {
			font-family: 'Cinzel', serif;
			font-optical-sizing: auto;
			font-weight: 600;
		}

		button {
			font-size: 1.5rem;
		}

		.actions {
			position: fixed;
			bottom: 10px;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			flex-direction: row;
			width: 90vw;
			gap: 10px;

			button {
				padding: 10px 20px;
				border-radius: 5px;
				border: none;
				background-color: var(--primary-500);
				color: var(--primary-50);
				cursor: pointer;
				width: 100%;
			}
		}
	}

	.end-leaderboard p {
		margin: 0;
		display: flex;
		flex-direction: row;
		gap: 5px;
		font-family: 'Cinzel', serif;
		font-optical-sizing: auto;
		font-weight: 600;

		&.negative {
			color: red;
		}

		span {
			width: 30px;
			align-items: center;
			display: flex;
			justify-content: center;
			font-weight: bold;

			font-family: 'Cinzel', serif;
			font-optical-sizing: auto;
			font-weight: 900;
		}
	}

	.end-leaderboard .players {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		justify-content: center;
		margin-bottom: 40px;
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
</style>
