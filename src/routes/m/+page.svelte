<script lang="ts">
	import { DataProxy, getDataProxy } from 'src/operational/dataProvider.svelte';
	import * as domain from 'src/domain/entities';
	import { formatAmount } from 'src/domain/services';
	import { onMount } from 'svelte';

	const dataProxy: DataProxy = getDataProxy();

	// UI STATE
	let transactionsHistory: domain.Transaction[] = $state([]);
	let equityItems: domain.Equity[] = $state([]);

	onMount(async () => {
		const [transactionsHistoryPaginated, equity] = await Promise.all([
			dataProxy.fetchTransactions({ limit: 10 }),
			dataProxy.fetchEquity()
		]);

		transactionsHistory = transactionsHistoryPaginated.result;
		equityItems = equity;
	});
	function transactionRepr(transaction: domain.Transaction): string {
		const message = `${transaction.name} ${formatAmount(transaction.value)}${transaction.currency}`;

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
						href="/m/analytics/transactions?currencyId={equity.currency.id.toString()}"
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
	<section id="actionsSection">
		<h1>🏃 Actions</h1>
		<div id="actionItems">
			<a href="/m/exchange" id="exchangeButton">exchange</a>
			<a href="/m/incomes" id="incomeButton">income</a>
			<a href="/m/costs" id="costButton">cost</a>
		</div>
	</section>
	<section id="historySection">
		<h1>📝 History</h1>

		{#if !transactionsHistory}
			<p>loading...</p>
		{:else}
			{#each transactionsHistory as item}
				<p>
					{transactionRepr(item)} <span> by {item.user.toLowerCase()}</span>
				</p>
			{/each}
		{/if}
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		width: 100%;
	}

	h1 {
		font-size: xx-large;
		margin-top: 10px;
		margin-bottom: 40px;
	}

	section {
		padding: 20px;
		border: solid 2px;
		border-radius: 0.5rem;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.equityItem {
		font-size: large;
	}

	#actionItems {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	#equityItems {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 3rem;
	}

	#historySection {
		flex: 0 0 400px;
		margin-bottom: 100px;
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
		background-color: darksalmon;
	}
	#incomeButton {
		border: solid 3px darkseagreen;
		border-radius: 0.5rem;
		background-color: darkseagreen;
	}

	#exchangeButton {
		border: solid 3px lightskyblue;
		border-radius: 0.5rem;
		background-color: lightskyblue;
	}
</style>
