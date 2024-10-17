<main class="home">
	<h1>Skull King</h1>
	<div class="main-menu">
		<a href="/create">Create new game</a>
		<a href="/">History</a>
	</div>
</main>

<style lang="scss">
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		height: 100vh;

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
	}

	.main-menu a {
		margin: 0 10px;
		text-decoration: none;
		background-color: var(--primary-500);
		color: var(--primary-50);
		padding: 10px 20px;
		border-radius: 5px;
		width: 80vw;
		text-align: center;
	}
</style>
