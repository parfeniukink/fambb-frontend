<script lang="ts">
	import NavDesktop from 'src/components/NavDesktop.svelte';
	import type { Notification } from 'src/domain/entities';
	import { getDataProxy, DataProxy } from 'src/operational/dataProvider.svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	// UI STATE
	let { children } = $props();
	const dataProxy: DataProxy = getDataProxy();
	let errorMessage = $state('');
	let token = $state('');

	let notifications: Notification[] = $state([]);
	async function sleep(s: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, s * 1000));
	}

	onMount(async () => {
		notifications = await dataProxy.fetchNotifications();

		// show toaster for 20 seconds
		for (let item of notifications) {
			await sleep(1);
			toast(item.message, {
				icon: item.level,
				position: 'bottom-right',
				duration: 20000,
				style: 'opacity: 0.8'
			});
		}
		notifications = [];
	});

	async function handleSubmit() {
		if (dataProxy.authState?.authenticated === true) {
			console.warn('User already authenticated');
		} else {
			dataProxy.authState = { token: token, authenticated: false };

			// note: try to fetch user to see if API server is live
			try {
				await dataProxy.fetchUser();
			} catch (error) {
				console.error(error);
				toast.error('Can not authorize', { position: 'bottom-left' });
				throw error;
			}

			dataProxy.authState = { token: token, authenticated: true };
			await dataProxy.loadData();
			dataProxy.refreshLocalStorage();
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

<Toaster />

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
