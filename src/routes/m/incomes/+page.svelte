<script lang="ts">
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { goto } from '$app/navigation';

	const dataProxy: DataProxy = getDataProxy();

	// FORM STATE STRUCTURE
	class IncomeCreateRequstBody {
		name: string = $state('');
		value: number | null = $state(null);
		source: string = $state('');
		timestamp: string = $state(new Date().toISOString().slice(0, 10));
		currencyId: number | null = $state(null);

		constructor(configuration: domain.Configuration) {
			this.currencyId = configuration.defaultCurrency?.id ?? null;
			this.source = 'revenue';
		}
	}

	// UI STATE
	let createRequestBody: IncomeCreateRequstBody = $state(
		new IncomeCreateRequstBody(dataProxy.userState!.configuration)
	);

	const incomeSources: string[] = ['revenue', 'gift', 'debt', 'other'];
	let currencyId: number | null = null;

	// FUNCTIONS
	function submitBackButton() {
		if (currencyId) {
			goto(`/d/analytics/transactions?currencyId=${currencyId}`);
		} else {
			throw new Error('Can not get back without knowing the currency');
		}
	}

	function sumbitResetButton() {
		createRequestBody = new IncomeCreateRequstBody(dataProxy.userState!.configuration);
	}

	async function sumbitAddButton() {
		if (createRequestBody) {
			try {
				await dataProxy.addIncome({
					name: createRequestBody.name,
					value: createRequestBody.value,
					source: createRequestBody.source,
					timestamp: createRequestBody.timestamp,
					currencyId: createRequestBody.currencyId
				});
				goto('/m');
			} catch (err) {
				console.error(err);
				submitBackButton();
			}
		}
	}
</script>

{#if !dataProxy.currenciesState || !createRequestBody}
	<p>loading...</p>
{:else}
	<section>
		<h1>add income</h1>
		<p>-------------------------</p>

		<div class="groupOfItems">
			<input id="date" type="date" bind:value={createRequestBody.timestamp} />

			<select id="sourceSelector" bind:value={createRequestBody.source}>
				{#each incomeSources as source}
					<option value={source}>{source}</option>
				{/each}
			</select>
		</div>

		<div class="groupOfItems">
			<input id="name" placeholder="name..." type="text" bind:value={createRequestBody.name} />
			<select
				id="incomeNameSelector"
				bind:value={createRequestBody.name}
				onchange={(e) => {
					if (createRequestBody != null) {
						const target = e.target as HTMLSelectElement;
						createRequestBody.name = target.value;
						target.value = 'not existing';
					}
				}}
			>
				{#if dataProxy.userState && dataProxy.userState.configuration.incomeSnippets}
					<option selected value=""></option>
					{#each dataProxy.userState.configuration.incomeSnippets as template}
						<option value={template}>{template}</option>
					{/each}
				{/if}
			</select>
		</div>

		<div class="groupOfItems">
			<input
				id="value"
				type="text"
				inputmode="decimal"
				pattern="\d*"
				bind:value={createRequestBody.value}
				placeholder="value..."
			/>
			<select id="currencySelector" bind:value={createRequestBody.currencyId}>
				{#each dataProxy.currenciesState as currency}
					<option value={currency.id}>{currency.sign}</option>
				{/each}
			</select>
		</div>

		<button id="reset" onclick={sumbitResetButton}>reset</button>
		<button id="add" onclick={sumbitAddButton}>add</button>
	</section>
{/if}

<style>
	section {
		margin-top: 30px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 10px;
		padding: 0 40px;
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
		font-size: large;
		width: 100%;
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

	#sourceSelector {
		flex: 2;
	}

	#name {
		flex: 8;
	}
	#incomeNameSelector {
		flex: 2;
		border-color: gray;
	}
	#value {
		flex: 8;
	}
	#currencySelector {
		flex: 2;
	}

	#add {
		border: solid 3px darkseagreen;
		background-color: darkseagreen;
	}

	#reset {
		border: solid 3px darkcyan;
		background-color: darkcyan;
	}
</style>
