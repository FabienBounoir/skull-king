<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AddIcon from '$lib/components/AddIcon.svelte';
	import { api } from '$lib/utils/api';
	import { scale, slide } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';

	let users = [];
	let games = [];

	let teamName = 'default';

	const timeFormater = (date) => {
		const time = new Date(date).getTime();

		return new Date(time).toLocaleString('fr', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});
	};

	const getData = async () => {
		games = api.get('/games?team=' + teamName);
		users = api.get('/players?team=' + teamName);
	};

	onMount(() => {
		if (window.localStorage?.getItem?.('team-name')) {
			teamName = window.localStorage.getItem('team-name');
		}

		getData();
	});
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
		← History
	</h1>
</div>

<div class="main-container">
	<div class="players">
		<h2>Users Statistics</h2>

		{#await users}
			{#each Array(Math.floor(Math.random() * 2) + 1).fill(0) as _}
				<div class="player skeleton">
					<p>➜ <span>------ </span></p>
					<div>
						<p>
							<span>0 / 0</span>
							<i class="fa-solid fa-chart-simple"></i>
						</p>
						<p>
							<span>0 / 0</span>
							<i class="fa-solid fa-crown"></i>
						</p>
					</div>
				</div>
			{/each}
		{:then users}
			{#each users as user, index}
				<div
					class="player clickable"
					class:rainbow={['fabien', 'bouns', 'fab'].includes(user.name.toLowerCase())}
					on:click={() => goto(`/player/${user.name}`)}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							goto(`/player/${user.name}`);
						}
					}}
					tabindex="0"
					role="button"
				>
					<p><span>➜ {user.name} </span></p>
					<div>
						<p>
							<span>{user.maxScore || 0} / {user?.lowerScore || 0}</span>
							<i class="fa-solid fa-chart-simple"></i>
						</p>

						<p>
							<span>{user.win || 0} / {user?.totalGame || 0}</span>
							<i class="fa-solid fa-crown"></i>
						</p>
					</div>
				</div>
			{/each}

			{#if users.length === 0}
				<p>No user found</p>
			{/if}
		{/await}

		<h2>Game History</h2>

		{#await games}
			{#each Array(Math.floor(Math.random() * 3) + 1).fill(0) as _}
				<div class="player skeleton">
					<p><i class="fa-solid fa-crown"></i> <span>----</span></p>
					<div>
						<p><span>----</span> <i class="fa-solid fa-user" /></p>
						<p>
							<span>----</span> <i class="fa-solid fa-calendar-days"></i>
						</p>
					</div>
				</div>
			{/each}
		{:then games}
			{#each games as game}
				<div 
					class="player clickable"
					on:click={() => goto(`/game/${game._id}`)}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							goto(`/game/${game._id}`);
						}
					}}
					tabindex="0"
					role="button"
				>
					<p class:rainbow={['fabien', 'bouns', 'fab'].includes(game.winner.toLowerCase())}>
						<span><i class="fa-solid fa-crown"></i> {game.winner}</span>
					</p>
					<div>
						<p><span>{game.score.length}</span> <i class="fa-solid fa-user" /></p>
						<p>
							<span>{timeFormater(game.date)}</span> <i class="fa-solid fa-calendar-days"></i>
						</p>
					</div>
				</div>
			{/each}

			{#if games.length === 0}
				<p>No game found</p>
			{/if}
		{/await}

		{#if games.length === 0}
			<p style="color: var(--primary-500);">No game found</p>
		{/if}
	</div>
</div>

<style lang="scss">
	h1 {
		color: white;
		font-size: 3rem;
	}

	i,
	i::after,
	i::before {
		font-family: 'Font Awesome 6 Free' !important;
	}

	.spacer {
		width: 100%;
	}

	.rainbow {
		animation: rainbow 2s infinite alternate;

		* {
			animation: rainbow 2s infinite alternate;
		}

		> * {
			filter: brightness(0.5);
		}
	}

	@keyframes rainbow {
		0% {
			color: #ff0000;
		}
		16% {
			color: #ff8000;
		}
		33% {
			color: #ffff00;
		}
		50% {
			color: #80ff00;
		}
		66% {
			color: #00ff00;
		}
		83% {
			color: #00ff80;
		}
		100% {
			color: #00ffff;
		}
	}

	.player {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		gap: 10px;
		justify-content: space-between;
		padding: 3px 10px;
		background-color: var(--primary-100);
		color: var(--primary-400);
		border-radius: 5px;
		text-transform: uppercase;
		width: 90vw;
		transition: all 0.2s ease;

		&.clickable {
			cursor: pointer;

			&:hover {
				background-color: var(--primary-200);
				transform: translateY(-1px);
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			}

			&:active {
				transform: translateY(0);
			}

			&:focus {
				outline: 2px solid var(--primary-500);
				outline-offset: 2px;
			}
		}

		&.skeleton {
			span {
				background: var(--primary-500);
				border-radius: 5px;
			}

			p {
				animation: skeleton 0.7s infinite alternate;
			}

			@keyframes skeleton {
				0% {
					opacity: 0.5;
				}
				100% {
					opacity: 1;
				}
			}
		}

		div {
			display: flex;
			flex-direction: row;
			gap: 25px;
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

	.main-container .players {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.players h2 {
		color: var(--primary-50);
	}

	p {
		color: var(--primary-500);

		span {
			font-family: 'Cinzel', serif;
			font-optical-sizing: auto;
			font-weight: 600;
		}
	}
</style>
