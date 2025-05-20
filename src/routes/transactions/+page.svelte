<script lang="ts">
  import { goto } from "$app/navigation"
  import { page } from "$app/state"
  import { notification } from "$lib/services/notifications"
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
  import Checkbox from "$lib/components/Checkbox.svelte"

  let lastTransactionElement: HTMLElement

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
    currencyId && persistent.identity && transactions ? true : false
  )

  // Pagination definition
  let context: number = $state(0)
  let left: number = $state(0)
  let limit: number = $state(10)

  onMount(async () => {
    if (!currencyId) {
      goto("/")
      notification("Currency is not specified for the transactions history")
    }

    const transactionsResponse = await transactionsList(
      context,
      limit,
      Number(currencyId!)
    )
    context = transactionsResponse.context
    left = transactionsResponse.left
    transactions = [...transactions, ...transactionsResponse.result]
  })
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <main class="flex justify-start items-end gap-10">
    <!-- historical data -->
    <section class="w-120">
      <div class="flex flex-col gap-2 text-sm text-gray-300">
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
                  {`${TRANSACTION_OPERATIONS_MAPPER[transaction.operation]} ${transaction.name}`}
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
    </section>
    <!-- operations -->
    <section
      class="flex items-center gap-10"
      bind:this={lastTransactionElement}
    >
      {#if left > 0}
        <button
          class="w-32 px-4 py-2 rounded-lg cursor-pointer italic my-5 text-orange-400"
          onclick={async () => {
            const transactionsResponse = await transactionsList(
              context,
              limit,
              Number(currencyId!)
            )
            context = transactionsResponse.context
            left = transactionsResponse.left
            transactions.push(...transactionsResponse.result)
            // Scroll to bottom after new items
            setTimeout(() => {
              lastTransactionElement.scrollIntoView({ behavior: "smooth" })
            }, 50)
          }}>({`${left}`}) more...</button
        >
      {/if}
      <div class="w-32">
        <DecimalInput
          bind:value={limit}
          placeholder="limit pagination"
          inputmode="decimal"
        />
      </div>

      <p>only mine</p>
      <Checkbox bind:checked={showOnlyMine} />
    </section>
    <!-- filters-->
    <section class="flex gap-20 mb-20"></section>
  </main>
{/if}
