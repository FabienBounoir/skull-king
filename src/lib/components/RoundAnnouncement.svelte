<script>
	import { quintInOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	export let round;
	export let displayAnnouncement;
</script>

<div class="round-announcement" transition:fade={{ duration: 500, easing: quintInOut }}
	on:click={() => (displayAnnouncement = false)}
>
	<h1 transition:scale={{ delay: 300, duration: 800, opacity: 0.5, start: 0, easing: quintInOut }}>
		Round {round}
	</h1>
</div>

<style lang="scss">
	.round-announcement {
		z-index: 100;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100dvh;
		width: 100dvw;
		font-size: 2rem;
		color: var(--primary-50) !important;
		background-color: var(--primary-800);
	}
</style>
