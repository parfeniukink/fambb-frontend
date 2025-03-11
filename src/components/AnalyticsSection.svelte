<script lang="ts">
	import { formatAmount } from 'src/domain/services';

	let { title, analytics }: any = $props();
</script>

<section>
	<h1>{title}</h1>
	{#each analytics as item}
		<h2>[ {item.currency.name} ]</h2>
		<hr />
		<div class="container">
			<div class="summary">
				<div class="items">
					<p class="red-text">costs:</p>
					<p>
						{formatAmount(item.costs.total)}
						{item.currency.sign}
					</p>
				</div>
				<div class="items">
					<p class="green-text">incomes:</p>
					<p>
						{formatAmount(item.incomes.total)}
						{item.currency.sign}
					</p>
				</div>
				<div class="items">
					<p class="blue-text">currency exchange:</p>
					{#if item.fromExchanges > 0}
						<p>
							{`+ ${formatAmount(item.fromExchanges)} ${item.currency.sign}`}
						</p>
					{:else}
						<p>
							{`${formatAmount(item.fromExchanges)} ${item.currency.sign}`}
						</p>
					{/if}
				</div>
				<div class="items">
					<p class="bold-text">total ratio:</p>
					<p>{item.totalRatio} %</p>
				</div>

				{#if item.costs.categories}
					<br />
					<br />
					<br />
				{/if}

				{#each item.costs.categories as category}
					<div class="items">
						<p>{category.name}</p>
						<p>
							{formatAmount(category.total)}
							{item.currency.sign} <i>({category.ratio}%)</i>
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</section>

<style>
	section {
		border: solid 3px lightgray;
		border-radius: 1rem;
		padding: 2rem;
		min-width: 450px;
	}
	p {
		margin: auto 0.1;
		text-align: left;
	}
	i {
		font-style: italic;
		color: gray;
	}

	h1 {
		font-size: x-large;
	}
	h2 {
		font-weight: bolder;
		margin-top: 50px;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.summary {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
	}

	.items {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.red-text {
		color: #d68f97;
	}
	.green-text {
		color: #caf492;
	}
	.blue-text {
		color: #9bdce8;
	}
	.bold-text {
		font-weight: bold;
	}
</style>
