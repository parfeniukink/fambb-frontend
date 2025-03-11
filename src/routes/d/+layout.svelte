<script lang="ts">
	import NavDesktop from 'src/components/NavDesktop.svelte';
	import { getDataProxy, DataProxy } from 'src/operational/dataProvider.svelte';

	// UI STATE
	let { children } = $props();
	const dataProxy: DataProxy = getDataProxy();
	let errorMessage = $state('');
	let token = $state('');

	async function handleSubmit() {
		if (dataProxy.authState?.authenticated === true) {
			console.warn('User already authenticated');
		} else {
			dataProxy.authState = { token: token, authenticated: false };

			// note: try to fetch user to see if API server is live
			await dataProxy.fetchUser();

			dataProxy.authState = { token: token, authenticated: true };
			await dataProxy.loadData();
			dataProxy.refreshLocalStorage();
		}

		// validate if user could be obtained
		try {
		} catch (error) {
			console.error(`Fetching user is failed: ${error}`);
			throw error;
		}
	}
</script>

{#if dataProxy.authState?.authenticated}
	<NavDesktop />
	{@render children()}
{:else}
	<section>
		<div class="authCard">
			{#if errorMessage != ''}
				<p class="authError">{errorMessage}</p>
			{/if}
			<form onsubmit={handleSubmit}>
				<input
					autofocus
					type="password"
					bind:value={token}
					inputmode="decimal"
					pattern="\d*"
					placeholder="enter secret"
					required
				/>
				<button type="submit">sign in</button>
			</form>
		</div>
	</section>
{/if}

<style>
	section {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
	}
	input {
		font-size: x-large;
	}
	button {
		font-size: xx-large;
	}
	.authCard {
		width: 500px;
	}
</style>
