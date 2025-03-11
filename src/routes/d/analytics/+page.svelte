<script lang="ts">
	import { onMount } from 'svelte';
	import { type TransactionBasicAnalytics } from 'src/api/types';
	import { getDataProxy, DataProxy } from 'src/operational/dataProvider.svelte';
	import AnalyticsSection from 'src/components/AnalyticsSection.svelte';

	const dataProxy: DataProxy = getDataProxy();

	let errorMessage: string | null = $state(null);

	let currentMonthBasicAnalytics: TransactionBasicAnalytics[] = $state([]);
	let previousMonthBasicAnalytics: TransactionBasicAnalytics[] = $state([]);

	// todo: provide a flexible structure for custom transactions
	let customRangeBasicAnalytics: Record<string, TransactionBasicAnalytics[]> = $state({});

	// for seding requests for the basic analytics
	class Filters {
		startDate: string | null = $state(null);
		endDate: string = $state(new Date().toISOString().slice(0, 10));
		pattern: string | null = $state(null);
	}
	let filters = $derived(new Filters());

	onMount(async () => {
		const [currentMonth, previousMonth] = await Promise.all([
			dataProxy.fetchBasicAnalyticsByPeriod('current-month'),
			dataProxy.fetchBasicAnalyticsByPeriod('previous-month')
		]);

		if (currentMonth && previousMonth) {
			currentMonthBasicAnalytics = currentMonth;
			previousMonthBasicAnalytics = previousMonth;
		} else {
			errorMessage = 'no basic analytics';
		}
	});

	async function handleFetchBasicAnalytics() {
		try {
			const response = await dataProxy.fetchBasicAnalyticsFiltered(filters);
			const title = filters.pattern
				? `${filters.startDate} - ${filters.endDate}, ${filters.pattern}`
				: `${filters.startDate} - ${filters.endDate}`;
			customRangeBasicAnalytics[title] = response;
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div id="analyticsContent">
	<AnalyticsSection title={'📊 current month'} analytics={currentMonthBasicAnalytics} />
	<AnalyticsSection title={'📊 previous month'} analytics={previousMonthBasicAnalytics} />

	{#each Object.entries(customRangeBasicAnalytics) as [timestamp, analytics]}
		<AnalyticsSection title={`📊 ${timestamp}`} {analytics} />
	{/each}

	<div id="addAnalyticsBlockSection">
		<input id="startDate" class="inputDate" type="date" bind:value={filters.startDate} />
		<input id="endDate" class="inputDate" type="date" bind:value={filters.endDate} />
		<input
			id="pattern"
			class="inputPattern"
			type="text"
			bind:value={filters.pattern}
			placeholder="pattern"
		/>
		<button onclick={handleFetchBasicAnalytics}>add</button>
	</div>
</div>

<style>
	#analyticsContent {
		display: flex;
		justify-content: left;
		align-items: start;
		gap: 5rem;
		padding: 10px;
	}

	#addAnalyticsBlockSection {
		padding: 100px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 30%;
		gap: 10px;
		border: dotted 3px #eee;
		border-radius: 1rem;
	}
	input {
		padding: 30px;
		background-color: transparent;
		border: solid 2px lightgray;
		font-size: medium;
	}
	button {
		border: solid 3px darkslategrey;
		background-color: transparent;
		font-size: large;
		width: 100%;
	}
	button:hover {
		background-color: darkslategrey;
		border: solid 3px lightgray;
	}
</style>
