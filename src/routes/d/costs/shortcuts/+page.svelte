<script lang="ts">
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { goto } from '$app/navigation';

	const dataProxy: DataProxy = getDataProxy();

	// FORM STATE STRUCTURE
	class CostShortcutCreateRequstBody {
		name: string | null = $state(null);
		value: number | null = $state(null);
		currencyId: number | null = $state(null);
		categoryId: number | null = $state(null);

		constructor(configuration: domain.Configuration) {
			this.categoryId = configuration.defaultCostCategory?.id ?? null;
			this.currencyId = configuration.defaultCurrency?.id ?? null;
		}

		isValid() {
			if (!this.name || !this.currencyId || !this.categoryId) {
				throw new Error('the form is not valid');
			}
		}
	}

	// UI STATE
	let createRequestBody: CostShortcutCreateRequstBody = $state(
		new CostShortcutCreateRequstBody(dataProxy.userState!.configuration)
	);

	function sumbitResetButton() {
		createRequestBody = new CostShortcutCreateRequstBody(dataProxy.userState!.configuration);
	}

	async function sumbitAddButton() {
		try {
			createRequestBody.isValid();

			await dataProxy.addCostShortcut({
				name: createRequestBody.name,
				value: createRequestBody.value,
				currencyId: createRequestBody.currencyId,
				categoryId: createRequestBody.categoryId
			});

			goto('/d');
			sumbitResetButton();
		} catch (err) {
			console.error(err);
			sumbitResetButton();
		}
	}
</script>

{#if !dataProxy.costCategoriesState || !dataProxy.currenciesState}
	<p>loading...</p>
{:else}
	<main>
		<div id="costCard">
			<h1>cost shortcut</h1>
			<p>-------------------------</p>
			<div class="groupOfItems">
				<select id="categorySelector" bind:value={createRequestBody.categoryId}>
					{#each dataProxy.costCategoriesState as category}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div class="groupOfItems">
				<input id="name" placeholder="name..." type="text" bind:value={createRequestBody.name} />
				<select
					id="costNameSelector"
					value=""
					onchange={(e) => {
						const target = e.target as HTMLSelectElement;
						createRequestBody.name = target.value;
						target.value = '';
					}}
				>
					{#if dataProxy.userState && dataProxy.userState.configuration.costSnippets}
						<option selected value=""></option>
						{#each dataProxy.userState.configuration.costSnippets as template}
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

			<div class="groupOfItems">
				<button id="reset" onclick={sumbitResetButton}>reset</button>
				<button id="add" onclick={sumbitAddButton}>add</button>
			</div>
		</div>
	</main>
{/if}

<style>
	main {
		padding-top: 50px;
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

	#costCard {
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

	#categorySelector {
		flex: 2;
	}

	#name {
		flex: 8;
	}
	#costNameSelector {
		flex: 2;
		border-color: gray;
	}
	#value {
		flex: 8;
	}
	#currencySelector {
		flex: 2;
	}

	#reset {
		border: solid 3px darkcyan;
		background-color: transparent;
	}
	#reset:hover {
		background-color: darkcyan;
	}

	#add {
		border: solid 3px darksalmon;
		background-color: transparent;
	}
	#add:hover {
		background-color: darksalmon;
	}
</style>
