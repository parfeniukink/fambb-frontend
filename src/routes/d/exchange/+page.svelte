<script lang="ts">
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';

	const dataProxy: DataProxy = getDataProxy();

	// FORM STATE STRUCTURE
	class ExchangeCreateRequstBody {
		fromValue: number | null = $state(null);
		toValue: number | null = $state(null);
		fromCurrencyId: number | null = $state(null);
		toCurrencyId: number | null = $state(null);
		timestamp: string = $state(new Date().toISOString().slice(0, 10));

		constructor(configuration: domain.Configuration) {
			this.fromCurrencyId = configuration.defaultCurrency?.id ?? null;

			// fill the ``toCurrency`` if the default Currency is specified
			if (this.fromCurrencyId != null) {
				const currencies: domain.Currency[] = dataProxy.currenciesState!;
				for (const currency of currencies) {
					if (currency.id !== this.fromCurrencyId) {
						this.toCurrencyId = currency.id;
						break;
					}
				}
			}
		}
	}

	// UI STATE
	let createRequestBody: ExchangeCreateRequstBody = $state(
		new ExchangeCreateRequstBody(dataProxy.userState!.configuration)
	);

	// FUNCTIONS
	function submitBackButton() {
		goto('/d');
	}

	function sumbitResetButton() {
		createRequestBody = new ExchangeCreateRequstBody(dataProxy.userState!.configuration);
	}

	async function sumbitAddButton() {
		if (createRequestBody) {
			try {
				await dataProxy.addExchange({
					fromValue: createRequestBody.fromValue,
					toValue: createRequestBody.toValue,
					fromCurrencyId: createRequestBody.fromCurrencyId,
					toCurrencyId: createRequestBody.toCurrencyId,
					timestamp: createRequestBody.timestamp
				});
				submitBackButton();
			} catch (err) {
				console.error(err);
				toast('form is invalid. check input values', {
					icon: '⚠️',
					position: 'bottom-left',
					duration: 2000
				});
				submitBackButton();
			}
		}
	}
</script>

{#if !dataProxy.currenciesState}
	<p>loading...</p>
{:else}
	<main>
		<div id="exchangeCard">
			<h1>exchange</h1>
			<p>-------------------------</p>
			<div class="groupOfItems">
				<input id="date" type="date" bind:value={createRequestBody.timestamp} />
			</div>

			<div class="groupOfItems">
				<input
					class="value"
					type="text"
					inputmode="decimal"
					pattern="\d*"
					bind:value={createRequestBody.fromValue}
					placeholder="you give..."
				/>
				<select class="currencySelector" bind:value={createRequestBody.fromCurrencyId}>
					{#each dataProxy.currenciesState as currency}
						<option value={currency.id}>{currency.sign}</option>
					{/each}
				</select>
			</div>

			<div class="groupOfItems">
				<input
					class="value"
					type="text"
					inputmode="decimal"
					pattern="\d*"
					bind:value={createRequestBody.toValue}
					placeholder="you receive..."
				/>
				<select class="currencySelector" bind:value={createRequestBody.toCurrencyId}>
					{#each dataProxy.currenciesState as currency}
						<option value={currency.id}>{currency.sign}</option>
					{/each}
				</select>
			</div>

			<div class="groupOfItems">
				<button id="reset" onclick={sumbitResetButton}>reset</button>
				<button id="add" onclick={sumbitAddButton}>add</button>
			</div>
		</div>
	</main>
{/if}

<style>
	main {
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
		width: 40%;
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

	#date {
		padding: 30px;
		flex: 8;
	}

	.value {
		flex: 8;
	}
	.currencySelector {
		flex: 2;
	}

	#add {
		border: solid 3px lightskyblue;
		background-color: transparent;
	}

	#add:hover {
		background-color: lightskyblue;
	}

	#reset {
		border: solid 3px darkcyan;
		background-color: transparent;
	}
	#reset:hover {
		background-color: darkcyan;
	}
</style>
