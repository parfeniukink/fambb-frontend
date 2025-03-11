<script lang="ts">
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const dataProxy: DataProxy = getDataProxy();

	// FORM STATE STRUCTURE
	let costShortcuts: domain.CostShortcut[] | null = $state(null);

	async function handleCardClick(shortcut: domain.CostShortcut) {
		try {
			if (shortcut.value != null) {
				dataProxy.applyCostShortcut(shortcut.id);
			} else {
				goto(`/m/costs/shortcuts/${shortcut.id}/`);
			}
		} catch (e) {
			console.error(e);
		}
	}

	onMount(async () => {
		costShortcuts = await dataProxy.fetchCostShortcuts();
	});
</script>

{#if costShortcuts}
	<section>
		{#each costShortcuts as shortcut}
			<button onclick={() => handleCardClick(shortcut)}>
				<p class="title">{shortcut.name}</p>
				<p class="categoryName">{shortcut.category.name}</p>
				{#if shortcut.value}
					<p class="money">{shortcut.value} {shortcut.currency.sign}</p>
				{:else}
					<p>... {shortcut.currency.sign}</p>
				{/if}
			</button>
		{/each}

		<button
			id="addButton"
			onclick={() => {
				goto('/m/costs/shortcuts/add');
			}}
		>
			+
		</button>
	</section>
	<br />
	<br />
	<br />
{/if}

<style>
	section {
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: center;
	}
	button {
		display: flex;
		background: transparent;
		border: 1px solid lightgray;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 115px;
	}
	.title {
		font-size: medium;
	}
	.categoryName,
	.money {
		color: lightgray;
		font-size: small;
	}
	#addButton {
		font-size: large;
		font-weight: bold;
	}
</style>
