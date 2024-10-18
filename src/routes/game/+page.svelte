<script>
	import { goto } from '$app/navigation';
	import EndLeaderboard from '$lib/components/EndLeaderboard.svelte';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import PlayerProfile from '$lib/components/PlayerProfile.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

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

	let playerName = '';
	let startWith = 'ZERO';

	let customNewScore = 0;

	let actualScore = [];

	let positionNewUser = 0;

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

	function getTopLowerScore() {
		let findScore = {
			lower: 0,
			top: 0
		};

		for (let i = 0; i < actualScore.length; i++) {
			let score = actualScore[i][1];

			if (score < findScore.lower) {
				findScore.lower = score;
			}

			if (score > findScore.top) {
				findScore.top = score;
			}
		}

		return findScore;
	}

	function addNewPlayer() {
		if (playerName === '') {
			toast.error('Player name cannot be empty');
			return;
		}

		if (players.includes(playerName)) {
			toast.warning('Player already exists');
			return;
		}

		let manageRound = [];

		let score = 0;

		console.log('getTopLowerScore()', getTopLowerScore());

		if (startWith == 'LOW') {
			score = getTopLowerScore().lower;
		} else if (startWith == 'BEST') {
			score = getTopLowerScore().top;
		} else if (startWith == 'MIDDLE') {
			let findScore = getTopLowerScore();
			let echo = findScore.top - findScore.lower;

			score = findScore.lower + echo / 2;
		} else if (startWith == 'CUSTOM') {
			score = customNewScore;
		}

		for (let i = 0; i < rounds.length; i++) {
			let round = rounds[i];
			if (i == rounds.length - 2 && rounds.length > 1) {
				round.splice(positionNewUser + 1, 0, {
					player: playerName,
					winTurn: 0,
					betTurn: 0,
					capturePirate: 0,
					captureSirene: 0,
					captureSkullKing: 0,
					bonus: 0,
					rascal: 0,
					alliance: 0,
					custom: score
				});
			} else if (i == rounds.length - 1) {
				round.splice(positionNewUser + 1, 0, {
					player: playerName,
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

			manageRound.push(round);
		}

		rounds = [...manageRound];
		players = [...players, playerName];
		playerName = '';

		status = 'PLAY';
	}
</script>

<main class="game-container">
	{#if status == 'PLAY'}
		{#key (rounds, players, selectedRound)}
			<Leaderboard {rounds} {selectedRound} {players} bind:actualScore />
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
		<div class="navigation">
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

			<div class="add-player-info">
				<div>
					<label for="playerName">Player Name:</label>
					<input type="text" bind:value={playerName} placeholder="What is the player name?" />
				</div>

				<div style="display: flex; flex-direction: column;" class:hidden={rounds.length < 2}>
					<label for="playerName">It starts with how many points ?</label>
					<select bind:value={startWith}>
						<option value="ZERO">Zero points</option>
						<option value="LOW">Low score</option>
						<option value="BEST">Best score</option>
						<option value="MIDDLE">Middle score</option>
						<option value="CUSTOM">Custom score</option>
					</select>

					{#if startWith == 'CUSTOM'}
						<div>
							<input type="number" bind:value={customNewScore} placeholder="How many points?" />
						</div>
					{/if}
				</div>
			</div>

			<div style="display: flex; flex-direction: column;" class="add-player-info">
				<label for="playerName">Position in the list (after which player?)</label>
				<select bind:value={positionNewUser} placeholder="After which player?">
					{#each players as player, index}
						<option value={index}>{player}</option>
					{/each}
				</select>
			</div>

			<div class="navigation">
				<button style="transform: rotate(180deg); width: 20%;" on:click={() => (status = 'PLAY')}
					>➜</button
				>

				<button
					on:click={() => {
						addNewPlayer();
					}}>Add User</button
				>
			</div>
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

		button.add-player {
			background-color: var(--primary-500);
			color: var(--primary-50);
			width: 40px;
			height: 40px;
			border-radius: 5px;
			border: none;
			font-size: 1.8rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.add-player {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10vh;
		width: 100%;

		select {
			width: 100%;
			padding: 10px;
			border-radius: 5px;
			border: 1px solid var(--primary-500);
		}
	}

	.add-player-info {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 3vh;

		& > div {
			display: flex;
			flex-direction: column;
			width: 100%;
			gap: 1vh;

			& > div {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
		}

		.hidden {
			display: none !important;
		}

		input {
			padding: 10px;
			border-radius: 5px;
			border: 1px solid var(--primary-500);
		}
	}

	.game-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 90px;

		h1 {
			margin-bottom: 0;
			color: var(--primary-950);
		}
	}

	.navigation {
		display: flex;
		justify-content: center;
		gap: 10px;
		position: fixed;
		bottom: 30px;
		left: 50%;
		width: 90vw;
		transform: translateX(-50%);
		height: 50px;
	}

	.navigation button {
		background-color: var(--primary-500);
		color: var(--primary-50);
		padding: 10px 20px;
		border-radius: 5px;
		width: 100%;
		border: none;
	}
</style>
