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
			<p>default currency</p>
		</section>
		<section class="seletors">
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
			<p>default cost category</p>
		</section>

		<section class="inputs">
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
			<p>cost notification threshold</p>
		</section>

		<section class="selectors">
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
			<p>show equity</p>
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
			<input type="text" bind:value={newCostSnippet} placeholder="cost..." required />
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
			<input type="text" bind:value={newIncomeSnippet} placeholder="income..." required />
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

	hr {
		margin-top: 5rem;
		margin-left: 5rem;
		margin-right: 5rem;
	}

	.selectors {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
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
		height: 60px;
		border: 3px solid lightgray;
		font-size: large;
	}
	#topSections {
		padding: 0 3rem;
		display: flex;
		width: 100%;
		justify-content: space-between;
		text-align: center;
	}

	.snippets {
		margin: 1rem 0;
		display: flex;
		gap: 20px;
		align-content: center;
		padding: 0 3rem;
	}

	.snippetsItems {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		flex: 8;
	}
	.addSnippet {
		flex: 2;
	}

	.badget {
		background-color: transparent;
		border: 1px solid gray;
		padding: 6px 12px;
		height: 40px;
		min-width: 150px;
		border-radius: 2rem;
		overflow-x: hidden;
		color: darkgray;
	}
	.badget:hover {
		background-color: darksalmon;
		color: #eee;
		opacity: 0.7;
	}
	button {
		background-color: transparent;
	}
	input {
		background-color: transparent;
		border: 3px solid lightgray;
		height: 60px;
	}
	#showEquityCheckbox {
		background-color: transparent;
		width: 60px;
		font-size: x-large;
	}

	form {
		display: flex;
		align-items: center;
		flex: 3;
		gap: 30px;
	}
	form > button {
		border: 2px solid lightgray;
		height: 60px;
	}
	form > button:hover {
		background-color: darkseagreen;
	}
</style>
