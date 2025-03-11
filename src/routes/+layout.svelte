<script lang="ts">
	import '@picocss/pico';
	import '$styles/global.css';
	import { DATA_PROXY, DataProxy } from 'src/operational/dataProvider.svelte';
	import { setContext } from 'svelte';
	let { children } = $props();

	// set the data proxy to the global context to make it available
	// for both: desktop and mobile applications.
	setContext(DATA_PROXY, new DataProxy());
</script>

{@render children()}

<style>
	@font-face {
		font-family: 'ComicMono';
		src: url('/src/assets/fonts/ComicMono.ttf');
	}

	:root {
		--pico-border-radius: 0.5rem;
		--pico-typography-spacing-vertical: 1rem;
		--pico-font-family: 'ComicMono';
		--pico-font-weight: 400;
		--pico-color: #eee;
		background-color: #3a342e;
	}
</style>
