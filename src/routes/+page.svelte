<script>
	import { toast } from 'svelte-sonner';

	let audio = null;

	const playSound = () => {
		if (!audio) {
			audio = new Audio('/sounds/skull-king.mp3');
			audio.play();
		} else {
			audio.play();
		}
	};
</script>

<main class="home">
	<img
		on:click={() => {
			playSound();
		}}
		src="/skullking.svg"
		alt="SkullKing"
	/>

	<div class="main-menu">
		<a href="/create">Create A New Game</a>
		<a href="/history">History</a>
	</div>
</main>

<style lang="scss">
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		// background-color: black;

		h1 {
			color: var(--primary-950);
		}
	}
	.main-menu {
		height: 50dvh;
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin-top: 20px;
		align-items: center;
		gap: 10px;
		font-size: 1.5rem;
	}

	.main-menu a {
		margin: 0 10px;
		text-decoration: none;
		background-color: white;
		color: black;
		padding: 10px 20px;
		border-radius: 5px;
		width: 80vw;
		text-align: center;
	}
</style>
