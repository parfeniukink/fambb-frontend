<script lang="ts">
  import { page } from "$app/state"
  import type { Transaction } from "$lib/types/money"
  import { onMount } from "svelte"
  import { persistent } from "$lib/data/persistent.svelte"
  import {
    groupTransactionsByDate,
    prettyMoney,
    retrieveUrlFromTransaction,
  } from "$lib/services/finances"
  import { TRANSACTION_OPERATIONS_MAPPER } from "$lib/constants"
  import { transactionsList } from "$lib/data/api"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import ToggleButton from "$lib/components/ToggleButton.svelte"

  const isMobile = persistent.mobileDevice
  let lastTransactionElement: HTMLElement | null = $state(null)

  const currencyId: string | null = page.url.searchParams.get("currencyId")
  let transactions: Transaction[] = $state([])
  let showOnlyMine: boolean = $state(false)
  const groupedTransactions = $derived.by(() => {
    const filtered = showOnlyMine
      ? transactions.filter(
          (item) => item.user === persistent.identity!.user.name
        )
      : transactions

    return groupTransactionsByDate(filtered)
  })

  let dataLoaded: boolean = $derived(
    persistent.identity && transactions ? true : false
  )

  // Pagination definition
  let context: number = $state(0)
  let left: number = $state(0)
  let limit: number = $state(10)

  onMount(async () => {
    const transactionsResponse = await transactionsList(
      context,
      limit,
      currencyId ? Number(currencyId) : null
    )
    context = transactionsResponse.context
    left = transactionsResponse.left
    transactions.push(...transactionsResponse.result)
  })
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <section
    class={isMobile ? "w-full flex-col" : "flex justify-start items-end gap-10"}
  >
    <!-- DATA -->
    <div class="">
      <div class={`flex flex-col gap-2 text-xs ${isMobile ? "" : "w-120"}`}>
        {#each Object.entries(groupedTransactions) as aggregatedItem}
          <div
            class="py-1 font-semibold text-gray-400 border-b border-gray-600"
          >
            {aggregatedItem[0]}
          </div>
          {#each aggregatedItem[1] as transaction}
            <a
              href={retrieveUrlFromTransaction(transaction)}
              class="text-gray-100 hover:text-white flex justify-between"
            >
              <div class="flex justify-between w-full gap-5">
                <p class="grow">
                  {`${TRANSACTION_OPERATIONS_MAPPER[transaction.operation]} ${transaction.icon} ${transaction.name}`}
                </p>
                <p>
                  {prettyMoney(transaction.value)}{transaction.currency}
                </p>
                <p class="text-gray-500">{transaction.user}</p>
              </div>
            </a>
          {/each}
          <div class="mt-3"></div>
        {/each}
      </div>
    </div>

    <!-- ACTIONS -->
    <div
      class={isMobile
        ? "w-full flex-col text-center"
        : "flex items-center gap-10"}
      bind:this={lastTransactionElement}
    >
      {#if left > 0}
        <button
          class="w-32 px-4 py-2 rounded-lg cursor-pointer italic my-5 text-orange-300 hover:text-orange-500 text-center"
          onclick={async () => {
            const transactionsResponse = await transactionsList(
              context,
              limit,
              currencyId ? Number(currencyId!) : null
            )
            context = transactionsResponse.context
            left = transactionsResponse.left
            transactions.push(...transactionsResponse.result)
            // Scroll to bottom after new items
            setTimeout(() => {
              if (lastTransactionElement)
                lastTransactionElement.scrollIntoView({ behavior: "smooth" })
            }, 50)
          }}
          >more...({`${left}`})
        </button>
        <div class={isMobile ? "mb-5" : "w-32"}>
          <DecimalInput
            bind:value={limit}
            placeholder="limit"
            inputmode="decimal"
          />
        </div>
      {/if}

      <ToggleButton bind:checked={showOnlyMine} text="only mine" />
    </div>
    <!-- filters-->
    <section class="flex gap-20 mb-20"></section>
  </section>
{/if}
