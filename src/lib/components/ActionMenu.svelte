<script>
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	export let isOpenned;
	export let status;
	export let bidsDisplay = true;

	let validEndGame = false;

	onMount(() => {
		validEndGame = false;
	});
</script>

<span
	transition:fade={{ duration: 300, easing: quintOut }}
	class="handleOutsideClick"
	on:click={() => {
		isOpenned = false;
	}}
></span>

<main class="actionMenu" transition:fly={{ duration: 300, easing: quintOut, x: 10, y: -10 }}>
	<button
		on:click={() => {
			status = 'NEW_PLAYER';
			isOpenned = false;
		}}>Add New User</button
	>
	<button
		on:click={() => {
			status = 'REMOVE_PLAYER';
			isOpenned = false;
		}}>Remove User</button
	>
	{#if bidsDisplay}
		<button
			on:click={() => {
				bidsDisplay = false;
			}}>bids hidden</button
		>
	{:else}
		<button
			on:click={() => {
				bidsDisplay = true;
			}}>bids shown</button
		>
	{/if}

	<button
		class:confirm={validEndGame}
		on:click={() => {
			if (!validEndGame) {
				validEndGame = true;
				return;
			}
			status = 'EARLY_END';
			isOpenned = false;
		}}
	>
		{validEndGame ? 'Confirm' : 'End Game'}
	</button>
</main>

<style lang="scss">
	.handleOutsideClick {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100dvh;
		z-index: 4;
		backdrop-filter: brightness(0.7);
	}

	.actionMenu {
		z-index: 5;
		position: absolute;
		width: max-content;
		background-color: var(--primary-700);
		top: 45px;
		right: 0;
		display: flex;
		flex-direction: column;
		border-radius: 5px;

		button {
			font-size: 1.5rem;
			z-index: 5;
			padding: 10px 20px;
			border: none;
			background: none;

			color: var(--primary-50);
			cursor: pointer;
			width: 100%;

			&.confirm {
				animation: shake 0.5s infinite;

				@keyframes shake {
					0% {
						transform: rotate(0deg) scale(1);
					}

					25% {
						transform: rotate(10deg) scale(1.1);
					}

					50% {
						transform: rotate(-10deg) scale(1.1);
					}

					75% {
						transform: rotate(10deg) scale(1.1);
					}

					100% {
						transform: rotate(0deg) scale(1);
					}
				}
			}
		}
	}
</style>
