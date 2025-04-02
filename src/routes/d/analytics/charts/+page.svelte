<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { onMount } from 'svelte';

	// styles
	const chartWidth = 900;
	const chartHeight = 600;
	const paddings = {
		top: 50,
		left: 50,
		right: 50,
		bottom: 50
	};
	const color = 'gray';

	// lines drawing
	let data = $state([]);
	let xVar = $state([]);
	let yVars = $state([]);

	onMount(async () => {
		console.log('loading the data');
		data = [];
		xVar = [];
		yVars = [];
		console.log('data is loaded');
	});
</script>

<main>
	<svg width={chartWidth} height={chartHeight}>
		<g>
			<line
				x1={paddings.left}
				x2={chartWidth - paddings.right}
				y1={chartHeight - paddings.bottom}
				y2={chartHeight - paddings.bottom}
				stroke={color}
				stroke-width="2"
			/>
			<line
				x1={paddings.left}
				x2={paddings.left}
				y1={paddings.top}
				y2={chartHeight - paddings.bottom}
				stroke={color}
				stroke-width="2"
			/>
		</g>
		<g>
			{#each data as datum, i}
				{#each yVars as yVar}
					{#if i != data.length - 1}
						<line
							x1={xScale(data[i][xVar])}
							x2={xScale(data[i + 1][xVar])}
							y1={yScale(data[i][yVar])}
							y2={yScale(data[i + 1][yVar])}
							stroke="black"
							stroke-width="2"
						/>
					{/if}
				{/each}
			{/each}
		</g>
	</svg>
</main>

<style>
</style>
