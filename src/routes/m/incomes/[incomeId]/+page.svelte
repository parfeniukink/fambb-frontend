<script lang="ts">
	import { page } from '$app/stores';
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const dataProxy: DataProxy = getDataProxy();

	// FORM STATE STRUCTURE
	interface IncomeUpdateRequstBody {
		name: string;
		value: number;
		source: string;
		timestamp: string;
		currencyId: number;
	}
	let body: IncomeUpdateRequstBody | null = $state(null);

	const incomeSources: string[] = ['revenue', 'gift', 'debt', 'other'];
	const incomeId: number = Number($page.params.incomeId);
	let currencyId: number | null = null;

	onMount(async () => {
		const instance: domain.Income = await dataProxy.fetchIncome(incomeId);
		body = {
			name: instance.name,
			value: instance.value,
			source: instance.source,
			timestamp: instance.timestamp,
			currencyId: instance.currency.id
		};
		currencyId = instance.currency.id;
	});

	// UI STATE
	function submitBackButton() {
		if (currencyId) {
			goto(`/m/analytics/transactions?currencyId=${currencyId}`);
		} else {
			throw new Error('Can not get back without knowing the currency');
		}
	}

	async function sumbitUpdateButton() {
		if (body) {
			try {
				await dataProxy.updateIncome(incomeId, {
					name: body.name,
					value: body.value,
					source: body.source,
					timestamp: body.timestamp,
					currencyId: body.currencyId
				});
				submitBackButton();
			} catch (err) {
				console.error(err);
				submitBackButton();
			}
		}
	}

	async function sumbitDeleteButton() {
		try {
			dataProxy.deleteIncome(incomeId);
			submitBackButton();
		} catch (err) {
			console.error(err);
			submitBackButton();
		}
	}
</script>

{#if !dataProxy.currenciesState || !body}
	<p>loading...</p>
{:else}
	<section>
		<h1>income</h1>
		<p>-------------------------</p>
		<div class="groupOfItems">
			<input id="date" type="date" bind:value={body.timestamp} />

			<select id="sourceSelector" bind:value={body.source}>
				{#each incomeSources as source}
					<option value={source}>{source}</option>
				{/each}
			</select>
		</div>

		<div class="groupOfItems">
			<input id="name" placeholder="name..." type="text" bind:value={body.name} />
			<select
				id="incomeNameSelector"
				bind:value={body.name}
				onchange={(e) => {
					if (body != null) {
						const target = e.target as HTMLSelectElement;
						body.name = target.value;
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
				bind:value={body.value}
				placeholder="value..."
			/>
			<select id="currencySelector" bind:value={body.currencyId}>
				{#each dataProxy.currenciesState as currency}
					<option value={currency.id}>{currency.sign}</option>
				{/each}
			</select>
		</div>

		<button id="delete" onclick={sumbitDeleteButton}>delete</button>
		<button id="update" onclick={sumbitUpdateButton}>update</button>
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
		border: none;
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

	#delete {
		border: solid darksalmon;
		background-color: darksalmon;
	}
	#update {
		border: solid darkorange;
		background-color: darkorange;
	}
</style>
