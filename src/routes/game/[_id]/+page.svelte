<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { api } from '$lib/utils/api';
	import { scale, slide } from 'svelte/transition';

	let gameData = null;
	let teamName = 'default';
	let gameId = '';

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

	const getGameData = async () => {
		try {
			gameData = await api.get(`/games/${gameId}?team=${teamName}`);
		} catch (error) {
			console.error('Error fetching game data:', error);
		}
	};

	const calculateGameStats = (game) => {
		if (!game.score || game.score.length === 0) return {};

		const scores = game.score.map((player) => player[1]);
		const totalScore = scores.reduce((sum, score) => sum + score, 0);
		const averageScore = Math.round(totalScore / scores.length);
		const maxScore = Math.max(...scores);
		const minScore = Math.min(...scores);

		return {
			totalScore,
			averageScore,
			maxScore,
			minScore,
			playerCount: game.score.length
		};
	};

	const getPlayerRanking = (score) => {
		if (!score || score.length === 0) return [];

		return [...score]
			.sort((a, b) => b[1] - a[1])
			.map((player, index) => ({
				name: player[0],
				score: player[1],
				rank: index + 1,
				isWinner: index === 0
			}));
	};

	const goToPlayerProfile = (playerName) => {
		goto(`/player/${playerName}`);
	};

	onMount(() => {
		gameId = $page.params._id;

		if (window.localStorage?.getItem?.('team-name')) {
			teamName = window.localStorage.getItem('team-name');
		}

		getGameData();
	});
</script>

<div class="header">
	<h1
		style="cursor: pointer;"
		on:click={() => {
			goto('/history');
		}}
	>
		← Partie du {gameData ? timeFormater(gameData.date) : '...'}
	</h1>
</div>

<div class="main-container">
	{#if gameData}
		{@const stats = calculateGameStats(gameData)}
		{@const rankings = getPlayerRanking(gameData.score)}

		<!-- Game Statistics -->
		<div class="game-stats" transition:slide={{ duration: 300 }}>
			<h2>Statistiques de la partie</h2>
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-users"></i>
					</div>
					<div class="stat-content">
						<h3>Joueurs</h3>
						<p class="stat-value">{stats.playerCount}</p>
						<p class="stat-subtitle">participants</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-trophy"></i>
					</div>
					<div class="stat-content">
						<h3>Score gagnant</h3>
						<p class="stat-value">{stats.maxScore}</p>
						<p class="stat-subtitle">meilleur score</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-calculator"></i>
					</div>
					<div class="stat-content">
						<h3>Score moyen</h3>
						<p class="stat-value">{stats.averageScore}</p>
						<p class="stat-subtitle">moyenne générale</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-chart-line-down"></i>
					</div>
					<div class="stat-content">
						<h3>Score minimum</h3>
						<p class="stat-value">{stats.minScore}</p>
						<p class="stat-subtitle">plus faible score</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-sum"></i>
					</div>
					<div class="stat-content">
						<h3>Total des points</h3>
						<p class="stat-value">{stats.totalScore}</p>
						<p class="stat-subtitle">points cumulés</p>
					</div>
				</div>

				<div class="stat-card">
					<div class="stat-icon">
						<i class="fa-solid fa-calendar"></i>
					</div>
					<div class="stat-content">
						<h3>Date</h3>
						<p class="stat-value-small">{timeFormater(gameData.date)}</p>
						<p class="stat-subtitle">moment de la partie</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Player Rankings -->
		<div class="player-rankings">
			<h2>Classement des joueurs</h2>
			<div class="rankings-list">
				{#each rankings as player, index}
					<div
						class="player-card"
						class:winner={player.isWinner}
						class:rainbow={['fabien', 'bouns', 'fab'].includes(player.name.toLowerCase()) &&
							player.isWinner}
						transition:scale={{ duration: 200, delay: index * 100 }}
						on:click={() => goToPlayerProfile(player.name)}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								goToPlayerProfile(player.name);
							}
						}}
						tabindex="0"
						role="button"
					>
						<div class="rank-display">
							{#if player.rank === 1}
								<div class="rank-medal gold">
									<i class="fa-solid fa-crown"></i>
								</div>
							{:else if player.rank === 2}
								<div class="rank-medal silver">
									<i class="fa-solid fa-medal"></i>
								</div>
							{:else if player.rank === 3}
								<div class="rank-medal bronze">
									<i class="fa-solid fa-medal"></i>
								</div>
							{:else}
								<div class="rank-number">
									{player.rank}
								</div>
							{/if}
						</div>

						<div class="player-info">
							<div class="player-name">
								{player.name}
								{#if player.isWinner}
									<span class="winner-badge">GAGNANT</span>
								{/if}
							</div>
							<div class="player-details">
								<span class="score-info">Score: {player.score}</span>
								<span class="rank-info">#{player.rank}</span>
							</div>
						</div>

						<div class="player-stats">
							<div class="score-bar-container">
								<div
									class="score-bar"
									style="width: {(player.score / stats.maxScore) * 100}%"
									class:winner-bar={player.isWinner}
								></div>
							</div>
							<div class="percentage">
								{Math.round((player.score / stats.maxScore) * 100)}%
							</div>
						</div>

						<div class="click-indicator">
							<i class="fa-solid fa-chevron-right"></i>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="loading">
			<div class="loading-spinner"></div>
			<p>Chargement des données de la partie...</p>
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
			font-size: 2.5rem;
		}
	}

	.main-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		padding: 0 1rem;
	}

	.game-stats {
		width: 100%;
		max-width: 1200px;

		h2 {
			color: var(--primary-50);
			font-size: 2rem;
			text-align: center;
			margin-bottom: 2rem;
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

		.stat-value-small {
			color: var(--primary-600);
			font-size: 1.2rem;
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

	.player-rankings {
		width: 100%;
		max-width: 900px;

		h2 {
			color: var(--primary-50);
			font-size: 2rem;
			text-align: center;
			margin-bottom: 2rem;
		}
	}

	.rankings-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.player-card {
		background: var(--primary-100);
		border-radius: 15px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 2px solid transparent;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
			border-color: var(--primary-300);
		}

		&.winner {
			background: linear-gradient(135deg, var(--primary-100) 0%, rgba(255, 215, 0, 0.1) 100%);
			border-color: #ffd700;
		}

		&:focus {
			outline: 2px solid var(--primary-500);
			outline-offset: 2px;
		}
	}

	.rank-display {
		flex-shrink: 0;
	}

	.rank-medal {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;

		&.gold {
			background: linear-gradient(135deg, #ffd700, #ffed4e);
			color: #b45309;
		}

		&.silver {
			background: linear-gradient(135deg, #c0c0c0, #e5e7eb);
			color: #374151;
		}

		&.bronze {
			background: linear-gradient(135deg, #cd7f32, #d97706);
			color: #78350f;
		}
	}

	.rank-number {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: var(--primary-300);
		color: var(--primary-800);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: bold;
		font-family: 'Cinzel', serif;
	}

	.player-info {
		flex: 1;

		.player-name {
			color: var(--primary-800);
			font-size: 1.3rem;
			font-weight: bold;
			margin-bottom: 0.5rem;
			text-transform: capitalize;
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		.winner-badge {
			background: #10b981;
			color: white;
			padding: 0.2rem 0.8rem;
			border-radius: 20px;
			font-size: 0.7rem;
			font-weight: 600;
			text-transform: uppercase;
		}

		.player-details {
			display: flex;
			gap: 1rem;
			color: var(--primary-600);
			font-size: 0.9rem;
		}
	}

	.player-stats {
		flex: 1;
		max-width: 200px;

		.score-bar-container {
			background: var(--primary-200);
			height: 8px;
			border-radius: 4px;
			overflow: hidden;
			margin-bottom: 0.5rem;
		}

		.score-bar {
			height: 100%;
			background: var(--primary-400);
			transition: width 0.5s ease;

			&.winner-bar {
				background: linear-gradient(90deg, #10b981, #34d399);
			}
		}

		.percentage {
			text-align: center;
			color: var(--primary-600);
			font-size: 0.8rem;
			font-weight: 600;
		}
	}

	.click-indicator {
		color: var(--primary-400);
		font-size: 1.2rem;
		transition: transform 0.2s ease;
	}

	.player-card:hover .click-indicator {
		transform: translateX(5px);
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
