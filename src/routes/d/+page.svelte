<script lang="ts">
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { formatAmount } from 'src/domain/services';
	import { onMount } from 'svelte';
	import CostShortcutCard from 'src/components/CostShortcutCard.svelte';
	import { goto } from '$app/navigation';

	const dataProxy: DataProxy = getDataProxy();

	// UI STATE
	let transactionsHistory: domain.Transaction[] = $state([]);
	let costShortcuts: domain.CostShortcut[] = $state([]);
	let equityItems: domain.Equity[] = $state([]);

	// user tries to apply the shortcut. this satate will handle the data
	let showModal: boolean = $state(false);
	let currentShortcut: domain.CostShortcut | null = $state(null);
	let currentShortcutValue: number | null = $state(null);

	onMount(async () => {
		const [transactionsHistoryPaginated, shortcuts, equity] = await Promise.all([
			dataProxy.fetchTransactions({ limit: 10 }), // history
			dataProxy.fetchCostShortcuts(),
			dataProxy.fetchEquity()
		]);

		transactionsHistory = transactionsHistoryPaginated.result;
		costShortcuts = shortcuts;
		equityItems = equity;
	});

	// called if user pressed on the ``CostShortuctut`` card
	function transactionFromCost(instance: domain.Cost): domain.Transaction {
		return {
			id: instance.id,
			operation: 'cost',
			name: instance.name,
			value: instance.value,
			timestamp: instance.timestamp,
			currency: instance.currency.sign,
			user: instance.user
		};
	}

	function transactionRepr(transaction: domain.Transaction): string {
		const message = `${transaction.name} ... ${formatAmount(transaction.value)} ${transaction.currency}`;

		switch (transaction.operation) {
			case 'cost': {
				return ['-', message].join(' ');
			}
			case 'income': {
				return ['+', message].join(' ');
			}
			case 'exchange': {
				return ['=', message].join(' ');
			}
			default: {
				throw Error(`Unrecoginzed transaction operation: ${transaction.operation}`);
			}
		}
	}

	// handle UI changes to prevent page reloading
	async function handleCardClick(shortcut: domain.CostShortcut) {
		try {
			if (shortcut.value != null) {
				const cost: domain.Cost = await dataProxy.applyCostShortcut(shortcut.id);

				// change the history section
				transactionsHistory.unshift(transactionFromCost(cost));
				transactionsHistory.pop();

				// change the equity section
				equityItems.map((element) => {
					if (element.currency.id === cost.currency.id) {
						element.amount -= cost.value;
					}
				});
			} else {
				showModal = true;
				currentShortcut = shortcut;
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function applyShortcut() {
		if (!currentShortcut || !currentShortcutValue) {
			throw new Error('no shortcut selected');
		} else {
			// close the modal
			showModal = false;

			const cost: domain.Cost = await dataProxy.applyCostShortcut(currentShortcut.id, {
				value: currentShortcutValue!
			});

			// equity section
			equityItems.map((element) => {
				if (element.currency.id === cost.currency.id) {
					element.amount -= cost.value;
				}
			});

			// transactions history section
			transactionsHistory.unshift(transactionFromCost(cost));
			transactionsHistory.pop();

			// clean current shortcut state
			currentShortcut = null;
			currentShortcutValue = null;
		}
	}

	function getHistoryItemUrl(transaction: domain.Transaction): string {
		switch (transaction.operation) {
			case 'cost':
				return `/d/costs/${transaction.id}`;
			case 'income':
				return `/d/incomes/${transaction.id}`;
			case 'exchange':
				return `/d/exchange/${transaction.id}`;
		}

		throw new Error(`unrecognized transaction ${transaction.operation}`);
	}
	function getHistoryItemColor(transaction: domain.Transaction): string {
		switch (transaction.operation) {
			case 'cost':
				return 'darksalmon';
			case 'income':
				return 'darkseagreen';
			case 'exchange':
				return 'lightskyblue';
		}

		throw new Error(`unrecognized transaction ${transaction.operation}`);
	}
</script>

<main>
	<section class="outline" id="equitySection">
		<h1>🏦 Equity</h1>
		<div id="equityItems">
			{#if !equityItems}
				<p>loading...</p>
			{:else}
				{#each equityItems as equity}
					<a
						href="/d/analytics/transactions?currencyId={equity.currency.id.toString()}"
						class="equityItem"
					>
						{#if dataProxy.userState?.configuration.showEquity}
							{formatAmount(equity.amount)}
						{:else}
							*****
						{/if}
						{equity.currency.sign}
					</a>
				{/each}
			{/if}
		</div>
	</section>
	<section id="historySection">
		<h1>📝 History</h1>

		{#if !transactionsHistory}
			<p>loading...</p>
		{:else}
			{#each transactionsHistory as item}
				<p class="historyItem">
					<a
						href={getHistoryItemUrl(item)}
						style="--history-item-color: {getHistoryItemColor(item)}">{transactionRepr(item)}</a
					>
					<i>by {item.user.toLowerCase()}</i>
				</p>
			{/each}
		{/if}
	</section>

	<section id="shortcutsSection">
		<h1>🗂️ Shortcuts</h1>
		<div id="shortcutsItems">
			{#each costShortcuts as shortcut}
				<CostShortcutCard
					{shortcut}
					onClick={() => handleCardClick(shortcut)}
					onDelete={() => {
						dataProxy.deleteCostShortcut(shortcut.id);
						costShortcuts = costShortcuts.filter((item) => item.id !== shortcut.id);
					}}
				/>
			{/each}
			<button
				aria-hidden="true"
				id="addCostShortcut"
				onclick={() => {
					goto('/d/costs/shortcuts');
				}}
			>
				add
			</button>
		</div>
	</section>

	<section id="actionsSection">
		<h1>🏃 Actions</h1>
		<div id="actionItems">
			<a href="/d/costs" id="costButton">cost</a>
			<a href="/d/incomes" id="incomeButton">income</a>
			<a href="/d/exchange" id="exchangeButton">exchange</a>
		</div>
	</section>
</main>

{#if showModal}
	<div
		aria-hidden="true"
		class="modalOverlay"
		onclick={() => {
			showModal = false;
			currentShortcutValue = null;
		}}
	>
		<div
			aria-hidden="true"
			class="modalContent"
			onclick={(e) => {
				e.stopPropagation();
			}}
		>
			<input
				autofocus
				id="shortcutValue"
				type="number"
				bind:value={currentShortcutValue}
				placeholder="value..."
			/>
			<button id="applyCostShortcut" onclick={applyShortcut}>add</button>
		</div>
	</div>
{/if}

<style>
	h1 {
		font-size: xx-large;
		margin-top: 10px;
		margin-bottom: 40px;
	}

	main {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: start;
		gap: 50px;
	}

	section {
		padding: 20px;
		border: solid 3px;
		border-radius: 0.5rem;
		justify-content: center;
		align-items: center;
	}

	i {
		font-size: small;
		margin-left: 1rem;
		color: gray;
	}

	#actionItems {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.equityItem {
		font-size: large;
	}

	#equityItems {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		gap: 30px;
	}

	#equityItems a:hover {
		color: darkseagreen;
	}

	#historySection {
		flex: 0 0 400px;
		flex-direction: column;
		gap: 100px;
	}

	.historyItem {
		display: flex;
		justify-content: space-between;
		font-size: medium;
	}
	.historyItem a {
		color: lightgray;
	}

	.historyItem a:hover {
		color: var(--history-item-color);
	}

	#shortcutsSection {
		min-width: 350px;
		max-width: 550px;
		flex-shrink: 1;
	}

	#shortcutsItems {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}

	#addCostShortcut {
		background: transparent;
		border: 2px solid lightgray;
		min-width: 6rem;
		font-weight: 400;
		text-align: center;
		margin-bottom: 1rem;
	}

	#addCostShortcut:hover {
		border: 2px solid darkseagreen;
		cursor: pointer;
	}

	#actionItems a {
		padding: 20px 40px;
		color: #eee;
		font-size: large;
		text-align: center;
	}

	#costButton {
		border: solid 3px darksalmon;
		border-radius: 0.5rem;
		background-color: transparent;
	}
	#costButton:hover {
		border: solid 3px darksalmon;
		background-color: darksalmon;
	}

	#incomeButton {
		border: solid 3px darkseagreen;
		border-radius: 0.5rem;
		background-color: transparent;
	}
	#incomeButton:hover {
		border: solid 3px darkseagreen;
		background-color: darkseagreen;
	}

	#exchangeButton {
		border: solid 3px lightskyblue;
		border-radius: 0.5rem;
		background-color: transparent;
	}
	#exchangeButton:hover {
		border: solid 3px lightskyblue;
		background-color: lightskyblue;
	}

	.modalOverlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.8); /* Blurred background effect */
		backdrop-filter: blur(5px);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: opacity 0.3s ease;
	}

	.modalContent {
		background: none;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
		min-width: 300px;
		position: relative;
	}

	.modalContent input {
		background-color: transparent;
		min-height: 100px;
		min-width: 250px;
		font-size: large;
		border: 3px solid lightgray;
	}
	.modalContent button {
		border: solid 3px darksalmon;
		background-color: transparent;
		width: 100%;
		min-height: 100px;
		font-size: x-large;
	}
	.modalContent button:hover {
		background-color: darksalmon;
	}
</style>
