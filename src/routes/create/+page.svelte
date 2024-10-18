<script>
	import { Toaster, toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let players = [];
	let playerName = '';

	onMount(() => {
		players = JSON.parse(localStorage.getItem('players')) || [];
	});

	function canAddPlayer(name) {
		if (name === '') {
			toast.error('Player name cannot be empty');
			return false;
		}

		if (players.includes(name)) {
			toast.warning('Player already exists');
			return false;
		}

		return true;
	}
</script>

<h1>Create</h1>

<div class="main-container">
	<div class="players">
		<h2>Players</h2>

		{#each players as player}
			<div class="player">
				<p>{player}</p>
				<button on:click={() => (players = players.filter((p) => p !== player))}>❌</button>
			</div>
		{/each}

		<div class="add-player">
			<input
				type="text"
				bind:value={playerName}
				placeholder="Player Name"
				on:keydown={(e) =>
					e.key === 'Enter' &&
					canAddPlayer(playerName) &&
					(() => {
						players = [...players, playerName];
						playerName = '';
					})}
			/>
			<button
				disabled={!playerName}
				on:click={() => {
					if (canAddPlayer(playerName)) {
						let name = playerName.trim();
						name = name.charAt(0).toUpperCase() + name.slice(1);

						players = [...players, name];
						playerName = '';
					}
				}}>Add</button
			>
		</div>

		<button
			disabled={players.length < 2 || playerName}
			on:click={() => {
				localStorage.setItem('players', JSON.stringify(players));
				goto('/game');
			}}>Start Game</button
		>
	</div>
</div>

<style lang="scss">
	h1 {
		color: var(--primary-950);
	}

	.main-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		h2 {
			color: var(--primary-950);
		}
	}

	.main-container p {
		margin: 0;
	}

	.main-container .players {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	input {
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--primary-500);
	}

	.players > button {
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		background-color: var(--primary-500);
		color: var(--primary-50);
		cursor: pointer;
		width: 90vw;

		&:disabled {
			background-color: var(--primary-200);
			color: var(--primary-950);
		}
	}

	.add-player button {
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		background-color: var(--primary-500);
		color: var(--primary-50);
		cursor: pointer;

		&:disabled {
			background-color: var(--primary-200);
			color: var(--primary-950);
		}
	}

	.add-player {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-direction: row;
		width: 90vw;
	}

	.add-player input {
		width: 100%;
	}

	.players .player {
		padding: 10px;
		border-radius: 5px;
		background-color: var(--primary-200);
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90vw;

		button {
			background-color: var(--primary-50);
			border: none;
			border-radius: 5px;
			height: 30px;
			width: 30px;
		}
	}
</style>
