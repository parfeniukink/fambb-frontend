<script lang="ts">
	import { page } from '$app/stores';
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import { goto } from '$app/navigation';

	const dataProxy: DataProxy = getDataProxy();

	const shortcutId: number = Number($page.params.shortcutId);
	let value: number | null = $state(null);

	async function applyShortcut() {
		if (!shortcutId || !value) {
			throw new Error('no shortcut selected');
		} else {
			goto('/m/costs/shortcuts');

			dataProxy.applyCostShortcut(shortcutId, {
				value: value
			});
		}
	}
</script>

<section>
	<input autofocus type="number" pattern="\d*" bind:value placeholder="value..." />
	<button onclick={applyShortcut}>add</button>
</section>

<style>
	section {
		margin-top: calc(40%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 10px;
		padding: 0 10%;
	}
	input {
		width: 100%;
		min-height: 100px;
		background-color: transparent;
		border: solid 2px lightgray;
		font-size: medium;
	}
	button {
		width: 100%;
		min-height: 100px;
		border: solid darksalmon;
		background-color: darksalmon;
	}
</style>
