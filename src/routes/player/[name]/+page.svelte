<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { api } from '$lib/utils/api';
	import { scale, slide } from 'svelte/transition';

	let playerData = null;
	let teamName = 'default';
	let playerName = '';

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

	const calculateWinRate = (player) => {
		if (!player.history || player.history.length === 0) return 0;
		return Math.round((player.win / player.history.length) * 100);
	};

	const calculateAverageScore = (player) => {
		if (!player.history || player.history.length === 0) return 0;
		const totalScore = player.history.reduce((sum, game) => sum + game.score, 0);
		return Math.round(totalScore / player.history.length);
	};

	const getPlayerData = async () => {
		try {
			playerData = await api.get(`/players/${playerName}?team=${teamName}`);
		} catch (error) {
			console.error('Error fetching player data:', error);
		}
	};

	onMount(() => {
		playerName = $page.params.name;

		if (window.localStorage?.getItem?.('team-name')) {
			teamName = window.localStorage.getItem('team-name');
		}

		getPlayerData();
	});
</script>

<div class="header">
	<h1
		style="cursor: pointer;"
		on:click={() => {
			goto('/history');
		}}
	>
		← {playerName}
	</h1>
</div>

<div class="main-container">
	{#if playerData}
		<div class="player-stats" transition:slide={{ duration: 300 }}>
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-trophy"></i>
					</div>
					<div class="stat-content">
						<h3>Victoires</h3>
						<p class="stat-value">{playerData.win || 0}</p>
						<p class="stat-subtitle">sur {playerData.history?.length || 0} parties</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-percentage"></i>
					</div>
					<div class="stat-content">
						<h3>Taux de victoire</h3>
						<p class="stat-value">{calculateWinRate(playerData)}%</p>
						<p class="stat-subtitle">pourcentage de réussite</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-chart-line"></i>
					</div>
					<div class="stat-content">
						<h3>Score max</h3>
						<p class="stat-value">{playerData.maxScore || 0}</p>
						<p class="stat-subtitle">meilleur performance</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-angles-down"></i>
					</div>
					<div class="stat-content">
						<h3>Score min</h3>
						<p class="stat-value">{playerData.lowerScore || 0}</p>
						<p class="stat-subtitle">plus faible score</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-calculator"></i>
					</div>
					<div class="stat-content">
						<h3>Score moyen</h3>
						<p class="stat-value">{calculateAverageScore(playerData)}</p>
						<p class="stat-subtitle">performance moyenne</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-gamepad"></i>
					</div>
					<div class="stat-content">
						<h3>Parties jouées</h3>
						<p class="stat-value">{playerData.history?.length || 0}</p>
						<p class="stat-subtitle">total des parties</p>
					</div>
				</div>
			</div>
		</div>

		<div class="games-history">
			<h2>Historique des parties</h2>

			{#if playerData.history && playerData.history.length > 0}
				<div class="games-list">
					{#each playerData.history.sort((a, b) => new Date(b.date) - new Date(a.date)) as game, index}
						<div
							class="game-card clickable"
							class:victory={game.winner}
							class:rainbow={['fabien', 'bouns', 'fab'].includes(playerName.toLowerCase()) &&
								game.winner}
							transition:scale={{ duration: 200, delay: index * 50 }}
							on:click={() => {
								if (game.gameId) {
									goto(`/game/${game.gameId}`);
								}
							}}
							on:keydown={(e) => {
								if ((e.key === 'Enter' || e.key === ' ') && game.gameId) {
									goto(`/game/${game.gameId}`);
								}
							}}
							tabindex="0"
							role="button"
						>
							<div class="game-header">
								<div class="game-result">
									{#if game.winner}
										<i class="fa-solid fa-crown victory-icon"></i>
										<span class="victory-text">Victoire</span>
									{:else}
										<i class="fa-solid fa-times defeat-icon"></i>
										<span class="defeat-text">Défaite</span>
									{/if}
								</div>
								<div class="game-date">
									{timeFormater(game.date)}
								</div>
							</div>

							<div class="game-score">
								<div class="score-display">
									<span class="score-label">Score:</span>
									<span class="score-value">{game.score}</span>
								</div>
								{#if game.gameId}
									<div class="click-indicator">
										<i class="fa-solid fa-chevron-right"></i>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="no-games">
					<i class="fa-solid fa-ghost"></i>
					<p>Aucune partie trouvée pour ce joueur</p>
				</div>
			{/if}
		</div>
	{:else}
		<div class="loading">
			<div class="loading-spinner"></div>
			<p>Chargement des données du joueur...</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;

		h1 {
			color: white;
			font-size: 3rem;
			text-transform: capitalize;
		}
	}

	.main-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		padding: 0 1rem;
	}

	.player-stats {
		width: 100%;
		max-width: 1200px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.stat-card {
		background: var(--primary-100);
		border-radius: 15px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease;

		&:hover {
			transform: translateY(-2px);
		}
	}

	.stat-icon {
		background: var(--primary-500);
		color: white;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}

	.stat-content {
		flex: 1;

		h3 {
			color: var(--primary-800);
			font-size: 1rem;
			margin: 0 0 0.5rem 0;
			text-transform: uppercase;
			font-weight: 600;
		}

		.stat-value {
			color: var(--primary-600);
			font-size: 2rem;
			font-weight: bold;
			margin: 0;
			font-family: 'Cinzel', serif;
		}

		.stat-subtitle {
			color: var(--primary-400);
			font-size: 0.8rem;
			margin: 0.2rem 0 0 0;
		}
	}

	.games-history {
		width: 100%;
		max-width: 800px;

		h2 {
			color: var(--primary-50);
			font-size: 2rem;
			text-align: center;
			margin-bottom: 2rem;
		}
	}

	.games-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.game-card {
		background: var(--primary-100);
		border-radius: 10px;
		padding: 1.5rem;
		border-left: 4px solid var(--primary-300);
		transition: all 0.2s ease;

		&.clickable {
			cursor: pointer;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
			}

			&:focus {
				outline: 2px solid var(--primary-500);
				outline-offset: 2px;
			}
		}

		&.victory {
			border-left-color: #10b981;
			background: linear-gradient(135deg, var(--primary-100) 0%, rgba(16, 185, 129, 0.1) 100%);
		}

		&:not(.victory) {
			border-left-color: #ef4444;
			background: linear-gradient(135deg, var(--primary-100) 0%, rgba(239, 68, 68, 0.1) 100%);
		}
	}

	.game-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.game-result {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		.victory-icon {
			color: #10b981;
		}

		.defeat-icon {
			color: #ef4444;
		}

		.victory-text {
			color: #10b981;
			font-weight: 600;
			text-transform: uppercase;
		}

		.defeat-text {
			color: #ef4444;
			font-weight: 600;
			text-transform: uppercase;
		}
	}

	.game-date {
		color: var(--primary-400);
		font-size: 0.9rem;
	}

	.game-score {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.score-display {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: var(--primary-200);
		padding: 0.8rem 1.5rem;
		border-radius: 8px;

		.score-label {
			color: var(--primary-600);
			font-weight: 600;
		}

		.score-value {
			color: var(--primary-800);
			font-size: 1.5rem;
			font-weight: bold;
			font-family: 'Cinzel', serif;
		}
	}

	.click-indicator {
		color: var(--primary-400);
		font-size: 1.2rem;
		transition: transform 0.2s ease;
	}

	.game-card.clickable:hover .click-indicator {
		transform: translateX(5px);
		color: var(--primary-600);
	}

	.no-games {
		text-align: center;
		color: var(--primary-400);
		padding: 3rem;

		i {
			font-size: 3rem;
			margin-bottom: 1rem;
			opacity: 0.5;
		}

		p {
			font-size: 1.2rem;
		}
	}

	.loading {
		text-align: center;
		color: var(--primary-300);
		padding: 3rem;

		.loading-spinner {
			width: 50px;
			height: 50px;
			border: 4px solid var(--primary-200);
			border-top: 4px solid var(--primary-500);
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin: 0 auto 1rem;
		}

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}

	.rainbow {
		animation: rainbow 2s infinite alternate;

		* {
			animation: rainbow 2s infinite alternate;
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

	i,
	i::after,
	i::before {
		font-family: 'Font Awesome 6 Free' !important;
	}
</style>
