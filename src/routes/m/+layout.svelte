<script lang="ts">
	import NavMobile from 'src/components/NavMobile.svelte';
	import { getDataProxy, DataProxy } from 'src/operational/dataProvider.svelte';

	// UI STATE
	let { children } = $props();
	const dataProxy: DataProxy = getDataProxy();
	let token = $state('');

	async function handleSubmit() {
		if (dataProxy.authState?.authenticated === true) {
			console.warn('user already authenticated');
		} else {
			dataProxy.authState = { token: token, authenticated: false };

			// note: try to fetch user to see if API server is live
			await dataProxy.fetchUser();

			dataProxy.authState = { token: token, authenticated: true };
			await dataProxy.loadData();
			dataProxy.refreshLocalStorage();
		}

		try {
		} catch (error) {
			console.error(`Fetching user is failed: ${error}`);
			throw error;
		}
	}
</script>

{#if dataProxy.authState?.authenticated}
	{@render children()}
	<NavMobile />
{:else}
	<form onsubmit={handleSubmit}>
		<input
			type="password"
			bind:value={token}
			inputmode="decimal"
			pattern="\d*"
			placeholder="your token..."
			required
		/>
		<button type="submit">sign in</button>
	</form>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		margin-top: calc(40%);
		padding: 30px;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	input {
		font-size: large;
	}
	button {
		font-size: large;
		width: 100%;
	}
</style>
