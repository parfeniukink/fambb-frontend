<script lang="ts">
	import { page } from '$app/stores';
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const dataProxy: DataProxy = getDataProxy();

	// UI STATE
	let instance: domain.Exchange | null = $state(null);
	const exchangeId: number = Number($page.params.exchangeId);
	let toCurrencyId: number | null = null;

	onMount(async () => {
		instance = await dataProxy.fetchExchange(exchangeId);
		toCurrencyId = instance.toCurrency.id;
	});

	// UI STATE
	function submitBackButton() {
		if (instance) {
			goto(`/d/analytics/transactions?currencyId=${toCurrencyId}`);
		}
	}

	async function sumbitDeleteButton() {
		try {
			dataProxy.deleteExchange(exchangeId);
			submitBackButton();
		} catch (err) {
			console.error(err);
			submitBackButton();
		}
	}
</script>

{#if instance}
	<main>
		<div id="exchangeCard">
			<h1>exchange</h1>
			<p>-------------------------</p>
			<div class="groupOfItems">
				<input disabled id="date" type="date" bind:value={instance.timestamp} />
			</div>

			<div class="groupOfItems">
				<input
					class="value"
					type="text"
					inputmode="decimal"
					pattern="\d*"
					bind:value={instance.fromValue}
					placeholder="you give..."
					disabled
				/>
				<select disabled class="currencySelector" bind:value={instance.fromCurrency.sign}>
					<option>{instance.fromCurrency.sign}</option>
				</select>
			</div>

			<div class="groupOfItems">
				<input
					class="value"
					type="text"
					inputmode="decimal"
					pattern="\d*"
					bind:value={instance.toValue}
					disabled
				/>
				<select disabled class="currencySelector" bind:value={instance.toCurrency.sign}>
					<option>{instance.toCurrency.sign}</option>
				</select>
			</div>

			<div class="groupOfItems">
				<button id="delete" onclick={sumbitDeleteButton}>delete</button>
				<button
					id="update"
					disabled
					onclick={() => {
						throw new Error('updating the Exchange is not implemented yet');
					}}>update</button
				>
			</div>
		</div>
	</main>
{:else}
	<p>loading...</p>
{/if}

<style>
	main {
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 30px;
	}

	h1 {
		font-size: xx-large;
	}
	input {
		padding: 30px;
		background-color: transparent;
		border: solid 2px lightgray;
		font-size: large;
	}
	select {
		background-color: transparent;
		border: solid 2px lightgray;
		font-size: large;
	}

	button {
		padding: 20px 40px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		flex: 5;
		font-size: large;
	}

	#exchangeCard {
		padding: 100px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 10px;
		border: solid 3px #eee;
		border-radius: 1rem;
	}

	.groupOfItems {
		display: flex;
		width: 100%;
		gap: 20px;
	}

	.value {
		flex: 8;
	}
	.currencySelector {
		flex: 2;
	}

	#date {
		padding: 30px;
		flex: 8;
	}

	#delete {
		border: solid 3px darksalmon;
		background-color: transparent;
	}

	#delete:hover {
		background-color: darksalmon;
	}
	#update {
		border: solid 3px darkorange;
		background-color: transparent;
	}
	#update:hover {
		background-color: darkorange;
	}
</style>
