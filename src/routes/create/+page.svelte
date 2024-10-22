<script>
	import { Toaster, toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AddIcon from '$lib/components/AddIcon.svelte';
	import { scale } from 'svelte/transition';
	import { calculeMaxRound } from '$lib/utils/functionnality';

	let players = [];
	let playerName = '';

	let oldGameExists = false;
	let totalRound = 10;

	onMount(() => {
		players = JSON.parse(localStorage.getItem('players')) || [];

		if (localStorage.getItem('rounds')) {
			oldGameExists = true;
		}
	});

	function canAddPlayer(name) {
		if (name === '') {
			toast.error('Player name cannot be empty');
			return false;
		}

		if (players.some((p) => p.toLowerCase() === name.toLowerCase())) {
			toast.warning('Player already exists');
			return false;
		}

		return true;
	}

	function formatName(name) {
		return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	}
</script>

<div
	class="header"
	style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;"
>
	<h1
		style="cursor: pointer;"
		on:click={() => {
			goto('/');
		}}
	>
		← Create
	</h1>

	{#if oldGameExists}
		<button
			on:click={() => {
				goto('/game');
			}}
		>
			Continue The Game
		</button>
	{/if}
</div>

<div class="main-container">
	<div class="players">
		<h2>Players</h2>

		{#each players as player, i}
			<div class="player" in:scale>
				<p>{player}</p>
				<div class="actions">
					<div class="nav">
						<button
							disabled={i === 0}
							on:click={() => {
								const index = players.indexOf(player);
								if (index > 0) {
									[players[index], players[index - 1]] = [players[index - 1], players[index]];
								}
							}}>⬆</button
						>
						<button
							disabled={i === players.length - 1}
							on:click={() => {
								const index = players.indexOf(player);
								if (index < players.length - 1) {
									[players[index], players[index + 1]] = [players[index + 1], players[index]];
								}
							}}
							>⬇
						</button>
					</div>
					<button on:click={() => (players = players.filter((p) => p !== player))}>❌</button>
				</div>
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
						name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

						players = [...players, formatName(name)];
						playerName = '';

						const roundCanPlay = calculeMaxRound(players.length);

						if (roundCanPlay < totalRound) {
							totalRound = roundCanPlay;
							toast.warning(`You can play only ${roundCanPlay} rounds`);
						} else {
							totalRound = roundCanPlay;
						}
					}
				}}
				><AddIcon />
			</button>
		</div>

		<button
			disabled={players.length < 2 || playerName}
			on:click={() => {
				localStorage.removeItem('rounds');
				localStorage.removeItem('selectedRound');

				localStorage.setItem('players', JSON.stringify(players));
				goto('/game');
			}}>Start Game</button
		>
	</div>
</div>

<style lang="scss">
	h1 {
		color: white;
		font-size: 3rem;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		button {
			padding: 10px 20px;
			border-radius: 5px;
			border: none;
			background-color: var(--primary-500);
			color: var(--primary-50);
			cursor: pointer;
			font-size: 1rem;
		}
	}

	.main-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		h2 {
			color: var(--primary-950);
			font-size: 2rem;
		}
	}

	.main-container p {
		margin: 0;
		font-size: 1.2rem;
		letter-spacing: 1px;
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
		font-size: 1.2rem;
	}

	.players h2 {
		color: white;
	}

	.players .actions {
		display: flex;
		flex-direction: row;
		gap: 10px;

		.nav {
			display: flex;
			flex-direction: row;
			button:first-child {
				border-radius: 5px 0 0 5px;
				border-right: 1px solid var(--primary-500);
			}

			button:last-child {
				border-radius: 0 5px 5px 0;
			}
		}

		button {
			cursor: pointer;
			color: var(--primary-700);

			&:disabled {
				color: var(--primary-200);
				cursor: not-allowed;
				opacity: 0.5;
			}
		}
	}

	.players > button {
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		background-color: var(--primary-500);
		color: var(--primary-50);
		cursor: pointer;
		width: 90vw;
		font-size: 1.5rem;
		cursor: pointer;

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
		font-family: 'Pirata One', 'Nunito', system-ui;

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
			justify-content: center;
			align-items: center;
			display: flex;
		}
	}
</style>
