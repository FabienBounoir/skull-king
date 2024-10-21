<script>
	import { goto } from '$app/navigation';
	import EndLeaderboard from '$lib/components/EndLeaderboard.svelte';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import PlayerProfile from '$lib/components/PlayerProfile.svelte';
	import RoundAnnouncement from '$lib/components/RoundAnnouncement.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { quintInOut, quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';

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

	let alreadySave = false;

	//round Announcement
	let displayAnnouncement = false;

	//to add new player info
	let playerName = '';
	let startWith = 'ZERO';
	let customNewScore = '0';
	let actualScore = [];
	let positionNewUser = 0;

	let totalRound = 10;

	$: saveData(players, rounds, status, selectedRound);

	function saveData(players, rounds, status, selectedRound) {
		if (status == 'INIT') return;

		if (status == 'END') {
			localStorage.removeItem('rounds');
			localStorage.removeItem('selectedRound');
			return;
		}

		positionNewUser = players.length - 1;

		localStorage.setItem('players', JSON.stringify(players));
		localStorage.setItem('rounds', JSON.stringify(rounds));
		localStorage.setItem('selectedRound', selectedRound);
	}

	onMount(() => {
		try {
			players = JSON.parse(localStorage.getItem('players'));

			if (localStorage.getItem('rounds') && localStorage.getItem('selectedRound')) {
				rounds = JSON.parse(localStorage.getItem('rounds'));
				selectedRound = parseInt(localStorage.getItem('selectedRound'));
			} else {
				addNewRound();
			}

			status = 'PLAY';
		} catch (e) {
			console.error('Error parsing local storage', e);
			goto('/create');
		}
	});

	function addNewRound() {
		let newRound = [];
		displayAnnouncement = true;

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

		setTimeout(() => {
			displayAnnouncement = false;
		}, 2000);
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

		if (players.some((p) => p.toLowerCase() === playerName.toLowerCase())) {
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
			score = (findScore.lower + findScore.top) / 2;
		} else if (startWith == 'CUSTOM') {
			if (!customNewScore) {
				toast.error('Custom score cannot be empty');
				return;
			}

			if (isNaN(customNewScore)) {
				toast.error('Custom score must be a number');
				return;
			}

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

	function scrollToTop() {
		window.scrollTo({
			top: 0
		});
	}
</script>

<main class="game-container">
	{#if status == 'PLAY'}
		{#key (rounds, players, selectedRound)}
			<Leaderboard {rounds} {selectedRound} {players} bind:actualScore />
		{/key}

		<div class="round">
			<h1>Round {1 + selectedRound}</h1>
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
					style="font-size: 1.5rem;"
					on:click={() => {
						if (rounds.length < totalRound) {
							addNewRound();
							scrollToTop();
						} else {
							status = 'END';
						}
					}}
				>
					{#if rounds.length < 10}
						End Round
					{:else}
						End Game
					{/if}
				</button>
			{/if}
		</div>

		{#if displayAnnouncement}
			<RoundAnnouncement bind:displayAnnouncement round={rounds.length} />
		{/if}
	{:else if status == 'END'}
		<EndLeaderboard {rounds} {selectedRound} {players} bind:status bind:alreadySave />
	{:else if status == 'NEW_PLAYER'}
		<div class="add-player" in:fade={{ duration: 700, easing: quintInOut, axis: 'x' }}>
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
						<option value="LOW">Low score ({getTopLowerScore().lower}pts)</option>
						<option value="BEST">Best score ({getTopLowerScore().top}pts)</option>
						<option value="MIDDLE"
							>Middle score ({(getTopLowerScore().lower + getTopLowerScore().top) / 2}pts)</option
						>
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

			<div class="navigation" style="width: 100%;">
				<button style="transform: rotate(180deg); width: 20%;" on:click={() => (status = 'PLAY')}
					>➜</button
				>

				<button
					style="font-size: 1.5rem;"
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
			color: var(--primary-50) !important;
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
		color: var(--primary-50);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10vh;
		width: 100%;
		cursor: pointer;

		select {
			width: 100%;
			padding: 10px;
			border-radius: 5px;
			border: 1px solid var(--primary-500);
		}

		h1 {
			color: var(--primary-50) !important;
		}
	}

	.add-player-info {
		color: var(--primary-50);
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 3vh;

		label {
			font-size: 1.4rem;
		}

		* {
			font-size: 1.2rem;
		}

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
		margin-bottom: 30px;

		h1 {
			margin-bottom: 0;
			color: var(--primary-950);
		}
	}

	.navigation {
		display: flex;
		justify-content: center;
		gap: 10px;
		position: sticky;
		bottom: 25px;
		min-height: 50px;
		padding: 0 2.5vw;
		margin: 10px 0 0 0;
	}

	.navigation button {
		background-color: var(--primary-500);
		color: var(--primary-50);
		padding: 10px 20px;
		border-radius: 5px;
		width: 100%;
		font-size: 1.5rem;
		border: none;
		cursor: pointer;
	}
</style>
