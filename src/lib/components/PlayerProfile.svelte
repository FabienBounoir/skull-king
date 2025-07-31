<script>
	import Bet from '$lib/icons/Bet.svelte';
	import Deal from '$lib/icons/Deal.svelte';
	import Mermaid from '$lib/icons/Mermaid.svelte';
	import Skull from '$lib/icons/Skull.svelte';
	import Sword from '$lib/icons/Sword.svelte';

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
	 * @property {boolean} alreadySaved - Indique si le joueur a déjà enregistré ses mises.
	 */

	/** @type {PlayerRound} */
	export let player = {};
	export let index = 0;
	export let bidsDisplay = true;
	export let onTricksChange = null; // Callback pour notifier les changements

	const updateBet = (number) => {
		if (number < 0) {
			player.betTurn = 0;
		} else if (index + 1 < number) {
			player.betTurn = index + 1;
		} else {
			player.betTurn = number;
		}
	};
</script>

<main class="profile" class:disable={player.custom}>
	<h2
		on:click={() => {
			player.alreadySaved = !player.alreadySaved;
		}}
		class:rainbow={['bouns', 'fab', 'fabien'].includes(player?.player?.toLowerCase?.())}
	>
		{player.player}
	</h2>
	<h3>Bids</h3>
	<div class="bids">
		{#if bidsDisplay || !player.alreadySaved}
			<button class:selected={player.betTurn == 0} on:click={() => (player.betTurn = 0)}>{0}</button
			>
			{#each Array.from({ length: index + 1 }) as _, i}
				<button class:selected={player.betTurn == i + 1} on:click={() => (player.betTurn = i + 1)}
					>{i + 1}</button
				>
			{/each}

			{#if !bidsDisplay}
				<button class="validate" on:click={() => (player.alreadySaved = true)}> ✔ </button>
			{/if}
		{:else}
			<button on:click={() => updateBet(player.betTurn - 1)}>-1</button>
			<button on:click={() => updateBet(player.betTurn + 1)}>+1</button>
		{/if}
	</div>

	<h3>Tricks won</h3>
	<div class="bids" class:disable={!bidsDisplay && !player.alreadySaved}>
		<button class:selected={player.winTurn == 0} on:click={() => {
			player.winTurn = 0;
			onTricksChange && onTricksChange();
		}}>{0}</button>
		{#each Array.from({ length: index + 1 }) as _, i}
			<button class:selected={player.winTurn == i + 1} on:click={() => {
				player.winTurn = i + 1;
				onTricksChange && onTricksChange();
			}}
				>{i + 1}</button
			>
		{/each}
	</div>

	<h3>Bonus points</h3>
	<div class="bonus" class:disable={!bidsDisplay && !player.alreadySaved}>
		<button
			class:used={player.capturePirate > 0}
			on:click={() => {
				player.capturePirate++;
				if (player.capturePirate > 6) {
					player.capturePirate = 0;
				}
			}}
		>
			<Sword />

			<div class="tooltip">
				<span class="tooltiptext">
					{player.capturePirate}
				</span>
			</div>
		</button>

		<button
			class:used={player.captureSirene > 0}
			on:click={() => {
				player.captureSirene++;
				if (player.captureSirene > 2) {
					player.captureSirene = 0;
				}
			}}
		>
			<Mermaid />

			<div class="tooltip">
				<span class="tooltiptext">{player.captureSirene}</span>
			</div>
		</button>

		<button
			class:used={player.captureSkullKing > 0}
			on:click={() => {
				if (player.captureSkullKing > 0) {
					player.captureSkullKing = 0;
				} else {
					player.captureSkullKing = 1;
				}
			}}
		>
			<Skull />

			<div class="tooltip">
				<span class="tooltiptext">{player.captureSkullKing}</span>
			</div>
		</button>

		<button
			class:used={player.bonus > 0}
			style="font-size: 1.2rem"
			on:click={() => {
				player.bonus += 10;

				if (player.bonus > 50) {
					player.bonus = 0;
				}
			}}
		>
			+10

			<div class="tooltip">
				<span class="tooltiptext">{player.bonus}</span>
			</div>
		</button>
		<button
			class:used={player.rascal > 0}
			on:click={() => {
				player.rascal += 10;
				if (player.rascal > 20) {
					player.rascal = 0;
				}
			}}
		>
			<Bet />

			<div class="tooltip">
				<span class="tooltiptext">{player.rascal}</span>
			</div>
		</button>

		<button
			class:used={player.alliance > 0}
			on:click={() => {
				player.alliance++;
				if (player.alliance > 2) {
					player.alliance = 0;
				}
			}}
		>
			<Deal />

			<div class="tooltip">
				<span class="tooltiptext">{player.alliance}</span>
			</div>
		</button>
	</div>
</main>

<style lang="scss">
	.bids,
	.bonus {
		&.disable {
			button {
				pointer-events: none;
				filter: grayscale(1) brightness(0.7);
			}
		}
	}

	.profile {
		display: flex;
		flex-direction: column;
		background-color: var(--primary-200);
		color: var(--primary-950);
		border-radius: 10px;
		padding: 10px 10px 20px 10px;

		button {
			cursor: pointer;
		}

		.rainbow {
			filter: brightness(0.5);
			background: linear-gradient(
				90deg,
				#ff0000,
				#ff7f00,
				#ffff00,
				#00ff00,
				#0000ff,
				#4b0082,
				#8b00ff
			);
			background-size: 600% 600%;
			animation: rainbow 4s linear infinite;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;

			@keyframes rainbow {
				0% {
					background-position: 0% 82%;
				}
				50% {
					background-position: 100% 19%;
				}
				100% {
					background-position: 0% 82%;
				}
			}
		}

		h2 {
			text-align: center;
			text-transform: uppercase;
			margin: 0;

			font-family: 'Cinzel', serif;
			font-optical-sizing: auto;
			font-weight: 600;
		}

		h3 {
			margin-bottom: 5px;
		}

		&.disable {
			pointer-events: none;
			filter: grayscale(1) brightness(0.7);
		}
	}

	.bids {
		display: flex;
		flex-direction: row;
		gap: 10px;
		flex-wrap: wrap;

		.validate {
			background-color: green;
			color: #fff;
			font-size: 1.5rem;
			width: 40px;
			height: 40px;
			border-radius: 5px;
			border: none;
			font-weight: bold;
			aspect-ratio: 1;
			font-family: system-ui !important;
			transition: transform 0.2s;

			&:active {
				transform: scale(1.2);
			}
		}
	}

	.bids button {
		border-radius: 5px;
		color: var(--primary-950);
		border: none;
		font-weight: bold;
		width: 40px;
		font-size: 0.8em;
		aspect-ratio: 1;
		font-family: system-ui !important;
		transition: transform 0.2s;

		&:active {
			transform: scale(1.2);
		}
	}

	.bids button.selected {
		background-color: var(--primary-600);
		color: #fff;
	}

	.bonus {
		display: flex;
		flex-direction: row;
		gap: 10px;
		justify-content: space-evenly;
	}

	.bonus button {
		width: 50px;
		height: 50px;
		border-radius: 8px;
		border: none;
		position: relative;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary-950);
		transition: transform 0.2s;

		&.used {
			border: 3px solid var(--primary-600);
		}

		&:active {
			transform: scale(1.2);
		}
	}

	.bonus button .tooltip {
		position: absolute;
		bottom: -10px;
		right: -10px;
		border-radius: 100%;
		background-color: white;
		width: 20px;
		height: 20px;
		font-size: 0.8rem;
		font-weight: normal;
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1;

		.tooltiptext {
			aspect-ratio: 1;
			font-weight: 700;
			font-family: system-ui !important;
		}
	}
</style>
