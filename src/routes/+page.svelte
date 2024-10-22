<script>
	import myshades from '$lib/utils/myshades';
	import { toast } from 'svelte-sonner';

	let audio = null;

	const playSound = () => {
		if (!audio) {
			toast.loading('Ah ah ah ah ah !');
			audio = new Audio('/sounds/skull-king.mp3');
			audio.play();
		} else {
			audio.play();
		}
	};

	const changePalette = () => {
		let primary = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

		if (primary.length < 7) {
			primary = primary.padEnd(7, '0');
		}

		console.log('Initial Color selected', primary);

		myshades({
			primary
		});
	};
</script>

<main class="home">
	<img
		on:click={() => {
			playSound();
			changePalette();
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
		cursor: pointer;

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
		color: var(--primary-950);
		padding: 10px 20px;
		border-radius: 5px;
		width: 80vw;
		text-align: center;
	}
</style>
