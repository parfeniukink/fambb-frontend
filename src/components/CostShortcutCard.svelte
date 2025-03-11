<script lang="ts">
	import * as domain from 'src/domain/entities';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		shortcut,
		onClick,
		onDelete
	}: {
		shortcut: domain.CostShortcut;
		onClick: MouseEventHandler<HTMLButtonElement>;
		onDelete: MouseEventHandler<HTMLButtonElement>;
	} = $props();
</script>

<section>
	<button id="deleteButton" onclick={onDelete}>X</button>
	<button id="card" onclick={onClick}>
		<p>{shortcut.name}</p>
		<p id="categoryName">{shortcut.category.name}</p>
		{#if shortcut.value}
			<p class="money">{shortcut.value} {shortcut.currency.sign}</p>
		{:else}
			<p>... {shortcut.currency.sign}</p>
		{/if}
	</button>
</section>

<style>
	p {
		margin: 0 0;
	}

	#categoryName {
		margin-bottom: 3px;
		color: gray;
		font-style: italic;
		font-size: small;
	}

	#card {
		margin: 10px;
		padding: 10px;
		min-width: 100px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: transparent;
		font-size: medium;
		color: #eee;
		border: 1px solid lightgray;
		border-radius: 4px;
		overflow: hidden;
	}
	#card:hover {
		border: 1px solid darkseagreen;
	}

	.money {
		color: #caf492;
	}

	#deleteButton {
		position: absolute;
		opacity: 0.6;
		color: black;
		background: darksalmon;
		border: none;
		padding: 1px 8px;
		border-radius: 1rem;
	}
	#deleteButton:hover {
		opacity: 1;
		padding: 6px 20px;
	}
</style>
