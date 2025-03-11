<script lang="ts">
	import { page } from '$app/state';

	let activePage = $derived.by(() => {
		if (page.url) {
			const url = page.url.pathname;
			if (url.endsWith('\/m')) return 'dashboard';
			if (url.endsWith('analytics')) return 'analytics';
			if (url.endsWith('shortcuts')) return 'shortcuts';
			if (url.endsWith('settings')) return 'settings';
			return page.url.pathname;
		}
	});
</script>

<nav>
	<a href="/m">🖥️</a>
	<a href="/m/analytics">📊</a>
	<a href="/m/costs/shortcuts">🗂️</a>
	<a href="/m/settings">⚙️</a>
</nav>

<style>
	nav {
		position: fixed;
		height: 60px;
		width: 100%;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center; /* # vertical align */
		border-top: 2px solid white;
		background-color: #3a342e;
	}

	nav a {
		color: #32c181;
		text-align: center;
		text-decoration: none;
		flex-grow: 1;
		font-size: 1rem;
	}

	nav a:hover {
		color: white;
	}
</style>
