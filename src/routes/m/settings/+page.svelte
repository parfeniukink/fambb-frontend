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
	<section class="group">
		<p>default currency</p>
		<select
			value={dataProxy.userState!.configuration.defaultCurrency
				? dataProxy.userState!.configuration.defaultCurrency.id
				: null}
			onchange={(event) => {
				dataProxy.userState!.configuration.defaultCurrency =
					dataProxy.currenciesState!.find((item) => item.id == Number(event.currentTarget.value)) ??
					null;

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
	<section class="group">
		<p>default cost category</p>
		<select
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

	<section class="group">
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
	<hr />

	<section class="snippets">
		<div class="snippetsItems">
			{#each dataProxy.userState!.configuration.costSnippets as item}
				<button
					class="budget"
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
					class="budget"
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

	<br />
	<br />
	<br />
</main>

<style>
	main {
		padding: 10px;
		overflow-x: hidden;
	}
	section {
		width: 100%;
	}

	section p {
		font-size: large;
		margin-bottom: 2rem;
		color: darkgray;
		flex: 3;
	}

	section select {
		background-color: transparent;
		border: 3px solid lightgray;
		font-size: large;
		flex: 1;
	}

	.group {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	#showEquityCheckbox {
		padding: 20px;
		background-color: transparent;
		border: 3px solid lightgray;
		width: 30px;
		height: 30px;
	}

	.snippets {
		margin: 3rem 0;
		display: flex;
		flex-direction: column;
		gap: 30px;
		flex-wrap: wrap;
	}
	.snippetsItems {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}

	.budget {
		background-color: transparent;
		border: 1px solid lightgray;
		padding: 5px 10px;
		height: 100%;
		border-radius: 2rem;
	}

	form {
		display: flex;
		gap: 30px;
	}
	form > input {
		background-color: transparent;
		border: 3px solid lightgray;
		height: 50px;
	}
	form > button {
		background-color: transparent;
		border: 3px solid lightgray;
		height: 50px;
	}
</style>
