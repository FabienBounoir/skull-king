<script>
	import { goto } from '$app/navigation';
	import EndLeaderboard from '$lib/components/EndLeaderboard.svelte';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import PlayerProfile from '$lib/components/PlayerProfile.svelte';
	import { onMount } from 'svelte';

	/**
	 * Représente un joueur dans un nouveau tour.
	 * @typedef {Object} PlayerRound
	 * @property {string} player - Le nom ou l'identifiant du joueur.
	 * @property {number} winTurn - Le nombre de tours gagnés.
	 * @property {number} betTurn - Le montant des mises dans le tour.
	 * @property {number} capturePirate - Nombre de pirates capturés.
	 * @property {number} captureSirene - Nombre de sirènes capturées.
	 * @property {number} captureSkullKing - Nombre de Skull Kings capturés.
	 * @property {number} bonus - Bonus accumulé.
	 * @property {number} rascal - Compte des rascal.
	 * @property {number} alliance - Score d'alliance.
	 */

	/** @type {Array<PlayerRound>} */
	let players = [];
	let rounds = [];
	let status = 'INIT';

	let selectedRound = 0;

	onMount(() => {
		try {
			players = JSON.parse(localStorage.getItem('players'));
			addNewRound();

			status = 'PLAY';
		} catch (e) {
			console.error('Error parsing local storage', e);
			goto('/create');
		}
	});

	function addNewRound() {
		let newRound = [];

		for (let player of players) {
			newRound.push({
				player: player,
				winTurn: 0,
				betTurn: 0,
				capturePirate: 0,
				captureSirene: 0,
				captureSkullKing: 0,
				bonus: 0,
				rascal: 0,
				alliance: 0
			});
		}

		rounds = [...rounds, newRound];
		selectedRound = rounds.length - 1;
	}
</script>

<main class="game-container">
	{#if status == 'PLAY'}
		{#key (rounds, players, selectedRound)}
			<Leaderboard {rounds} {selectedRound} {players} />
		{/key}

		<div class="round">
			<h1>Round {selectedRound + 1}</h1>
			<button
				class="add-player"
				on:click={() => {
					status = 'NEW_PLAYER';
				}}>+</button
			>
		</div>

		{#each rounds as round, index}
			{#if index === selectedRound}
				{#each round as player}
					<PlayerProfile {player} {index} />
				{/each}
			{/if}
		{/each}
		<div class="round-navigation">
			{#if selectedRound < rounds.length - 1}
				{#if selectedRound > 0}
					<button
						style="transform: rotate(180deg);"
						on:click={() => (selectedRound = selectedRound - 1)}>➜</button
					>
				{/if}
				<button on:click={() => (selectedRound = selectedRound + 1)}>➜</button>
			{:else}
				{#if selectedRound > 0}
					<button
						style="transform: rotate(180deg);"
						on:click={() => (selectedRound = selectedRound - 1)}>➜</button
					>
				{/if}
				<button
					on:click={() => {
						if (rounds.length < 10) {
							addNewRound();
						} else {
							status = 'END';
						}
					}}>End Round</button
				>
			{/if}
		</div>
	{:else if status == 'END'}
		<EndLeaderboard {rounds} {selectedRound} {players} />
	{:else if status == 'NEW_PLAYER'}
		<div class="add-player">
			<h1>Add New User</h1>
		</div>
	{/if}
</main>

<style lang="scss">
	.round {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10px;

		h1 {
			margin: 0;
			color: var(--primary-950);
		}

		.add-player {
			background-color: var(--primary-500);
			color: var(--primary-50);
			width: 40px;
			height: 40px;
			border-radius: 5px;
			border: none;
			font-size: 1.8rem;
		}
	}

	.game-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 70px;

		h1 {
			margin-bottom: 0;
			color: var(--primary-950);
		}
	}

	.round-navigation {
		display: flex;
		justify-content: center;
		gap: 10px;
		position: fixed;
		bottom: 10px;
		left: 50%;
		width: 90vw;
		transform: translateX(-50%);
		height: 50px;
	}

	.round-navigation button {
		background-color: var(--primary-500);
		color: var(--primary-50);
		padding: 10px 20px;
		border-radius: 5px;
		width: 100%;
		border: none;
	}
</style>
