<script lang="ts">
	import '@picocss/pico';
	import '$styles/global.css';
	import { DATA_PROXY, DataProxy } from 'src/operational/dataProvider.svelte';
	import { setContext } from 'svelte';
	import favicon from '$src/static/favicon.ico';
	import favicon16x16 from '$src/static/favicon-16x16.png';
	import favicon32x32 from '$src/static/favicon-32x32.png';
	import appleTouchIcon from '$src/static/apple-touch-icon.png';

	let { children } = $props();

	// set the data proxy to the global context to make it available
	// for both: desktop and mobile applications.
	setContext(DATA_PROXY, new DataProxy());
</script>

<svelte:head>
	<link rel="icon" href={`${favicon}?v=M44lzPylqQ`} type="image/x-icon" sizes="any" />
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" sizes="16x16" href={favicon16x16} />
	<link rel="icon" sizes="32x32" href={favicon32x32} />
</svelte:head>
<!-- <!-1- <link rel="manifest" href="%svelte.assets%/site.webmaniflst" /> -1-> -->

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
