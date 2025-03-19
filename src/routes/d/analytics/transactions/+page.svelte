<script lang="ts">
	import { onMount } from 'svelte';
	import * as domain from 'src/domain/entities';
	import { formatAmount } from 'src/domain/services';
	import { getDataProxy, DataProxy } from 'src/operational/dataProvider.svelte';
	import { goto } from '$app/navigation';
	import type { ResponseMultiPaginated } from 'src/api/types';
	import { page } from '$app/state';

	// retrieve the ``currencyId`` from the URL
	const currencyId: string | null = page.url.searchParams.get('currencyId');

	// get the data proxy object
	const dataProxy: DataProxy = getDataProxy();

	// the current representation of transactions
	let transactionsByDates: Record<string, domain.Transaction[]> = $state(
		{} as Record<string, domain.Transaction[]>
	);
	let transactionByDatesFiltered: Record<string, domain.Transaction[]> = $derived.by(() => {
		if (showOnlyMine) {
			console.log('updated');
			return Object.fromEntries(
				Object.entries(transactionsByDates)
					.map(([date, transactions]) => [
						date,
						transactions.filter((transaction) => {
							return transaction.user.toLowerCase() === dataProxy.userState!.name.toLowerCase();
						})
					])
					.filter(([, _transactions]) => _transactions.length > 0)
			);
		} else {
			return transactionsByDates;
		}
	});

	let context: number = $state(0);
	let left: number = $state(0);
	let limit: number = $state(10);

	let showOnlyMine: boolean = $state(false);

	// dispatch the end of the link, based on the transaction information.
	// depends on transaction type we redirect to the recpective page
	function endRoute(transaction: domain.Transaction) {
		if (transaction.operation === 'cost') {
			return `/d/costs/${transaction.id.toString()}`;
		} else if (transaction.operation === 'income') {
			return `/d/incomes/${transaction.id.toString()}`;
		} else if (transaction.operation === 'exchange') {
			return `/d/exchange/${transaction.id.toString()}`;
		} else {
			throw Error(`Unrecognized transaction operation: ${transaction.operation}`);
		}
	}

	onMount(async () => {
		if (currencyId != null) {
			await loadTransactions();
		} else {
			goto('/');
		}
	});

	const loadTransactions = async () => {
		const response: ResponseMultiPaginated<domain.Transaction> = await dataProxy.fetchTransactions({
			currencyId: Number(currencyId),
			context: context,
			limit: limit
		});

		if (transactionsByDates) {
			for (const item of response.result) {
				const timestamp = item.timestamp.toString();

				if (!transactionsByDates[timestamp]) {
					transactionsByDates[timestamp] = []; // Initialize array if it doesn't exist
				}
				transactionsByDates[timestamp].push(item); // Add the transaction to the respective timestamp group
			}

			context = response.context;
			left = response.left;
		}
	};
</script>

<main>
	{#if currencyId == null}
		<p>loading...</p>
	{:else}
		<section id="settings">
			<div>
				<p>pagination limit</p>
				<input
					id="paginationLimitSetting"
					type="text"
					inputmode="numeric"
					pattern="\d*"
					bind:value={limit}
				/>
			</div>

			<div>
				<p>only mine</p>
				<input id="showOnlyMineSetting" type="checkbox" bind:checked={showOnlyMine} />
			</div>
		</section>
		<hr />
		<section>
			{#each Object.keys(transactionByDatesFiltered) as timestamp}
				<div class="timestampGroup">
					<!-- Display the timestamp  -->
					<h1>[ {timestamp} ]</h1>
					<!-- Display each transaction in the block  -->
					{#each transactionByDatesFiltered[timestamp] as transaction}
						<a href={endRoute(transaction)}
							><p class={transaction.operation}>
								{#if transaction.operation === 'cost'}
									-
								{:else if transaction.operation === 'income'}
									+
								{:else if transaction.operation === 'exchange'}
									=
								{/if}
								{transaction.name}
								<span class="money">
									{formatAmount(transaction.value)}
									{transaction.currency}
									<span class="username">by {transaction.user.toLowerCase()}</span>
								</span>
							</p>
						</a>
					{/each}
				</div>
			{/each}
		</section>
		<section id="navigation">
			{#if left > 0}
				<button id="loadMoreButton" onclick={loadTransactions}>load more...</button>
			{/if}
		</section>
	{/if}
</main>

<style>
	main {
		margin-left: 50px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: white;
		text-align: left;
	}
	#navigation {
		margin: 90px 0;
		display: flex;
		flex-direction: row;
		color: #b29849;
	}
	#loadMoreButton {
		text-align: left;
		background: none;
		border: none;
		color: #b29849;
		font-size: large;
	}

	.cost {
		color: #d68f97;
	}
	.income {
		color: #caf492;
	}
	.exchange {
		color: #9bdce8;
	}
	.timestampGroup h1 {
		margin-top: 2rem;
		font-size: large;
		font-weight: 500;
	}
	.money {
		margin-left: 10px;
	}
	.username {
		font-style: italic;
		font-size: x-small;
		color: gray;
		margin-left: 20px;
	}

	#settings {
		display: flex;
		justify-content: left;
		align-items: start;
		gap: 3rem;
	}
	#paginationLimitSetting {
		background: transparent;
		border: 2px solid lightgray;
		height: 4rem;
	}
	#showOnlyMineSetting {
		background-color: transparent;
		border: 3px solid lightgray;
		height: 4rem;
		width: 4rem;
		font-size: x-large;
	}
</style>
