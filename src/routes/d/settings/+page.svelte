<script lang="ts">
	import { getDataProxy, DataProxy } from 'src/operational/dataProvider.svelte';
	import { onMount } from 'svelte';

	const dataProxy: DataProxy = getDataProxy();
	let newCostSnippet: string = $state('');
	let newIncomeSnippet: string = $state('');

	// UI state
	onMount(() => {
		if (!dataProxy.currenciesState || !dataProxy.userState) {
			throw new Error('Data is not laod');
		}
	});
</script>

<main>
	<div id="topSections">
		<section class="seletors">
			<p>default currency</p>
			<select
				id="defaultCurrencySelector"
				value={dataProxy.userState!.configuration.defaultCurrency
					? dataProxy.userState!.configuration.defaultCurrency.id
					: null}
				onchange={(event) => {
					dataProxy.userState!.configuration.defaultCurrency =
						dataProxy.currenciesState!.find(
							(item) => item.id == Number(event.currentTarget.value)
						) ?? null;

					dataProxy.refreshLocalStorage();
					dataProxy.updateUserConfiguration({
						defaultCurrencyId: Number(event.currentTarget.value)
					});
				}}
			>
				{#each dataProxy.currenciesState! as currency}
					<option value={currency.id}>{currency.sign} ({currency.name})</option>
				{/each}
			</select>
		</section>
		<section class="seletors">
			<p>default cost category</p>
			<select
				id="defaultCostCategorySelector"
				value={dataProxy.userState!.configuration.defaultCostCategory
					? dataProxy.userState!.configuration.defaultCostCategory!.id
					: null}
				onchange={(event) => {
					dataProxy.userState!.configuration.defaultCostCategory =
						dataProxy.costCategoriesState!.find(
							(item) => item.id == Number(event.currentTarget.value)
						) ?? null;

					dataProxy.refreshLocalStorage();
					dataProxy.updateUserConfiguration({
						defaultCostCategoryId: Number(event.currentTarget.value)
					});
				}}
			>
				{#each dataProxy.costCategoriesState! as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
		</section>
		<section class="selectors">
			<p>show equity</p>
			<input
				id="showEquityCheckbox"
				type="checkbox"
				bind:checked={dataProxy.userState!.configuration.showEquity}
				onchange={() => {
					dataProxy.refreshLocalStorage();
					dataProxy.updateUserConfiguration({
						showEquity: dataProxy.userState!.configuration.showEquity
					});
				}}
			/>
		</section>

		<section class="inputs">
			<p>cost notification threshold</p>
			<input
				id="costNotificationThreshold"
				type="text"
				inputmode="decimal"
				pattern="\d*"
				placeholder="value..."
				bind:value={dataProxy.userState!.configuration.notifyCostThreshold}
				onchange={() => {
					console.log('updated local storage and configuration');
					dataProxy.refreshLocalStorage();
					dataProxy.updateUserConfiguration({
						notifyCostThreshold: dataProxy.userState!.configuration.notifyCostThreshold
					});
				}}
			/>
		</section>
	</div>

	<hr />

	<section class="snippets">
		<div class="snippetsItems">
			{#each dataProxy.userState!.configuration.costSnippets as item}
				<button
					class="badget"
					onclick={() => {
						dataProxy.userState!.configuration.costSnippets =
							dataProxy.userState!.configuration.costSnippets.filter((element) => element != item);
						dataProxy.updateUserConfiguration({
							costSnippets: dataProxy.userState!.configuration.costSnippets
						});
						dataProxy.refreshLocalStorage();
					}}>{item}</button
				>
			{/each}
		</div>
		<form
			class="addSnippet"
			onsubmit={() => {
				if (newCostSnippet) {
					if (dataProxy.userState!.configuration.costSnippets == null) {
						dataProxy.userState!.configuration.costSnippets = [newCostSnippet];
					} else {
						dataProxy.userState!.configuration.costSnippets.push(newCostSnippet);
					}
					newCostSnippet = '';
					dataProxy.updateUserConfiguration({
						costSnippets: dataProxy.userState!.configuration.costSnippets
					});
					dataProxy.refreshLocalStorage();
				}
			}}
		>
			<input type="text" bind:value={newCostSnippet} placeholder="cost snippet.." required />
			<button type="submit">add</button>
		</form>
	</section>
	<hr />
	<section class="snippets">
		<div class="snippetsItems">
			{#each dataProxy.userState!.configuration.incomeSnippets as item}
				<button
					class="badget"
					onclick={() => {
						dataProxy.userState!.configuration.incomeSnippets =
							dataProxy.userState!.configuration.incomeSnippets.filter(
								(element) => element != item
							);
						dataProxy.updateUserConfiguration({
							incomeSnippets: dataProxy.userState!.configuration.incomeSnippets
						});
						dataProxy.refreshLocalStorage();
					}}>{item}</button
				>
			{/each}
		</div>
		<form
			class="addSnippet"
			onsubmit={() => {
				if (newIncomeSnippet) {
					if (dataProxy.userState!.configuration.incomeSnippets == null) {
						dataProxy.userState!.configuration.incomeSnippets = [newIncomeSnippet];
					} else {
						dataProxy.userState!.configuration.incomeSnippets.push(newIncomeSnippet);
					}
					newIncomeSnippet = '';
					dataProxy.updateUserConfiguration({
						incomeSnippets: dataProxy.userState!.configuration.incomeSnippets
					});
					dataProxy.refreshLocalStorage();
				}
			}}
		>
			<input type="text" bind:value={newIncomeSnippet} placeholder="income snippet.." required />
			<button type="submit">add</button>
		</form>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.selectors {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.inputs {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	p {
		font-size: large;
		margin-bottom: 2rem;
		color: darkgray;
	}
	select {
		background-color: transparent;
		min-height: 80px;
		border: 3px solid lightgray;
		font-size: large;
	}
	#topSections {
		padding: 0 3rem;
		display: flex;
		width: 100%;
		justify-content: left;
		gap: 5rem;
		text-align: center;
	}

	#showEquityCheckbox {
		background-color: transparent;
		padding: 30px;
		font-size: xx-large;
		border: 3px solid lightgray;
	}

	.snippets {
		margin: 1rem 0;
		display: flex;
		gap: 20px;
		align-content: center;
		padding: 0 3rem;
	}
	.badget {
		background-color: transparent;
		border: 1px solid lightgray;
		padding: 6px 12px;
		height: 50px;
		min-width: 150px;
		border-radius: 2rem;
		overflow-x: hidden;
	}
	.badget:hover {
		background-color: darksalmon;
		opacity: 0.7;
	}

	.snippetsItems {
		display: flex;
		flex-wrap: wrap;
		flex: 8 0;
		gap: 20px;
	}
	button {
		background-color: transparent;
	}
	input {
		background-color: transparent;
		border: 2px solid lightgray;
		height: 80px;
	}
	form {
		display: flex;
		align-items: center;
		flex: 3;
		gap: 30px;
	}
	form > button {
		border: 2px solid lightgray;
		height: 80px;
	}
	form > button:hover {
		background-color: darkseagreen;
	}
</style>
