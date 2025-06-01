<script lang="ts">
  import { page } from "$app/state"
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import type { Exchange } from "$lib/types/money"
  import { exchangeDelete, exchangeRetrieve } from "$lib/data/api"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import { prettyMoney } from "$lib/services/finances"
  import { notification } from "$lib/services/notifications"
  import { persistent } from "$lib/data/persistent.svelte"

  const isMobile = persistent.mobileDevice
  const exchangeId = Number(page.params.exchangeId)
  let exchange: Exchange | null = $state(null)

  onMount(async () => {
    exchange = (await exchangeRetrieve(exchangeId)).result
  })
</script>

{#if !exchange}
  <main>loading...</main>
{:else}
  <Box
    title="Edit Exchange"
    titleCenter={isMobile}
    width={isMobile ? 0 : 140}
    border={isMobile ? 0 : 4}
    padding={isMobile ? "small" : "default"}
  >
    <div class="flex flex-col gap-6">
      <input
        type="date"
        value={exchange.timestamp}
        class="px-8 py-3 outline-none border-3 rounded-md text-white"
      />
      <div class="flex justify-between mx-8">
        <p>
          {prettyMoney(exchange.fromValue)}
          {exchange.fromCurrency.sign}
        </p>

        <p class="">{"💶"}</p>
        <p>
          {prettyMoney(exchange.toValue)}
          {exchange.toCurrency.sign}
        </p>
      </div>

      <div class="flex gap-4 mt-4">
        <Button
          title="delete"
          color="red"
          onclick={() => {
            goto("/")
            exchangeDelete(exchange!.id)
            notification({
              message: `Exchange ${exchange!.fromValue}${exchange!.fromCurrency.sign} -> ${exchange!.toValue}${exchange?.toCurrency.sign} deleted`,
              icon: "🗑️",
            })
            exchange = null
          }}
        />
      </div>
    </div>
  </Box>
{/if}
