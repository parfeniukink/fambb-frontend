<script lang="ts">
	import { page } from '$app/state';

	let activePage = $derived.by(() => {
		if (page.url) {
			const url = page.url.pathname;
			if (url.endsWith('\/d')) return 'dashboard';
			if (url.endsWith('analytics')) return 'analytics';
			if (url.endsWith('settings')) return 'settings';
			return page.url.pathname;
		}
	});
</script>

<nav>
	<ul>
		<li>
			<a href="/d/analytics" class={activePage == 'analytics' ? 'active' : ''}>ANALYTICS</a>
		</li>
		<li>
			<a href="/d" class={activePage == 'dashboard' ? 'active' : ''}>DASHBOARD</a>
		</li>
		<li>
			<a href="/d/settings" class={activePage == 'settings' ? 'active' : ''}>SETTINGS</a>
		</li>
	</ul>
</nav>
<hr />

<style>
	nav {
		overflow: hidden;
		margin: 40px 0px 20px 0px;
	}
	ul {
		display: flex;
		flex-flow: row;
		justify-content: space-around;
		font-size: x-large;
	}

	hr {
		margin-bottom: 40px;
	}

	.active {
		text-decoration: underline;
	}
</style>
