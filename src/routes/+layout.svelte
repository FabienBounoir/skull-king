<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.scss';
	import { onMount } from 'svelte';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	let loading = true;
	let hasTeamName = false;

	let inputData = '';

	setTimeout(() => {
		loading = false;
	}, 2000);

	onMount(() => {
		if (window.localStorage?.getItem?.('team-name')) {
			hasTeamName = true;
		}

		document.addEventListener(
			'dblclick',
			function (event) {
				event.preventDefault();
			},
			{ passive: false }
		);
	});

	const setTeamName = () => {
		if (inputData) {
			window.localStorage.setItem('team-name', inputData);
			hasTeamName = true;
		}
	};
</script>

<Toaster position="top-center" richColors />

{#if loading}
	<div class="loader">
		<img src="/skullking.png" alt="Skull King" />
	</div>
{/if}

{#if hasTeamName}
	<slot />
{:else}
	<div class="main-container">
		<h1>Enter your team name</h1>
		<input type="text" placeholder="Team Name" bind:value={inputData} />
		<button
			on:click={() => {
				setTeamName();
			}}>Submit</button
		>
	</div>
{/if}

<style lang="scss">
	.main-container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		min-height: 100dvh;

		color: var(--primary-50);
		gap: 20px;

		input {
			padding: 10px;
			border-radius: 5px;
			border: 1px solid var(--primary-500);
			font-size: 1.2rem;
			width: 90%;
		}

		button {
			background-color: var(--primary-500);
			color: var(--primary-50);
			padding: 10px 20px;
			border-radius: 5px;
			width: 90%;
			font-size: 1.5rem;
			border: none;
			cursor: pointer;
			transition: transform 0.2s;

			&:active {
				transform: scale(1.1);
			}
		}
	}

	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100dvh;
		width: 100dvw;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #000000;
		z-index: 1000;
		animation-delay: 1s;
		animation-name: opacity;
		animation-duration: 1s;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
		@keyframes opacity {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		img {
			width: 50%;
			height: auto;
			filter: drop-shadow(0 0 5px rgb(169, 168, 168));
			animation: spin 2s ease-in-out infinite;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg) scale(0);
		}

		80% {
			transform: rotate(380deg) scale(1);
		}

		90% {
			transform: rotate(360deg) scale(1);
		}

		100% {
			transform: rotate(360deg) scale(0);
		}
	}
</style>
