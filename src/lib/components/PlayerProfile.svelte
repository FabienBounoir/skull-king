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
	 */

	/** @type {PlayerRound} */
	export let player = {};
	export let index = 0;
</script>

<main class="profile" class:disable={player.custom > 0}>
	<h2>{player.player}</h2>
	<h3>Bids</h3>
	<div class="bids">
		<button class="selected" on:click={() => (player.betTurn = 0)}>{0}</button>
		{#each Array.from({ length: index + 1 }) as _, i}
			<button class:selected={i < player.betTurn} on:click={() => (player.betTurn = i + 1)}
				>{i + 1}</button
			>
		{/each}
	</div>

	<h3>Tricks won</h3>
	<div class="bids">
		<button class="selected" on:click={() => (player.winTurn = 0)}>{0}</button>
		{#each Array.from({ length: index + 1 }) as _, i}
			<button class:selected={i < player.winTurn} on:click={() => (player.winTurn = i + 1)}
				>{i + 1}</button
			>
		{/each}
	</div>

	<h3>Bonus points</h3>
	<div class="bonus">
		<button
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
	.profile {
		display: flex;
		flex-direction: column;
		background-color: var(--primary-200);
		color: var(--primary-950);
		border-radius: 10px;
		padding: 10px 10px 20px 10px;

		h2 {
			text-align: center;
			text-transform: uppercase;
			margin: 0;
		}

		&.disable {
			pointer-events: none;
			filter: grayscale(1);
		}
	}

	.bids {
		display: flex;
		flex-direction: row;
		/* justify-content: space-evenly; */
		gap: 10px;
		margin: 0 auto;
		flex-wrap: wrap;
	}

	.bids button {
		border-radius: 100%;
		background-color: #ffffff;
		color: var(--primary-950);
		border: none;
		font-weight: bold;
		width: 30px; /* Ajuste la largeur */
		height: 30px;
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
	}
</style>
