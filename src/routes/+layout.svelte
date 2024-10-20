<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.scss';
	import { onMount } from 'svelte';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	let loading = true;
	setTimeout(() => {
		loading = false;
	}, 2000);

	onMount(() => {
		document.addEventListener(
			'dblclick',
			function (event) {
				event.preventDefault();
			},
			{ passive: false }
		);
	});
</script>

<Toaster position="top-center" richColors />

{#if loading}
	<div class="loader">
		<img src="/skullking.png" alt="Skull King" />
	</div>
{/if}

<slot />

<style lang="scss">
	.main-container {
		padding: 5px;
		box-sizing: border-box;
		// min-height: 100vh;
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
