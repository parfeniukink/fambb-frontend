<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import CostShortcutComponent from "$lib/components/CostShortcut.svelte"

  import type { Transaction, CostShortcut, Equity } from "$lib/types/money"

  import { groupTransactionsByDate, prettyMoney } from "$lib/services/finances"
  import { goto } from "$app/navigation"
  import { persistent } from "$lib/data/persistent.svelte"
  import { onMount } from "svelte"
  import {
    costShortcutsList,
    equityList,
    transactionsList,
  } from "$lib/data/api"

  // ─────────────────────────────────────────────────────────
  // form the dataset to be provided as props to children
  // ─────────────────────────────────────────────────────────
  let equities: Equity[] | null = $state(null)
  let costShortcuts: CostShortcut[] | null = $state(null)
  let transactionsHistory: Transaction[] | null = $state(null)

  let dataLoaded: boolean = $derived(
    equities && costShortcuts && transactionsHistory ? true : false
  )

  onMount(async () => {
    const [equitiesResponse, costShortcutsResponse, transactionsResopnse] =
      await Promise.all([equityList(), costShortcutsList(), transactionsList()])

    equities = equitiesResponse.result
    costShortcuts = costShortcutsResponse.result
    transactionsHistory = transactionsResopnse.result
  })

  // ─────────────────────────────────────────────────────────
  // CONSTANTS DEFINITION
  // ─────────────────────────────────────────────────────────
  const TRANSACTION_OPERATIONS_MAPPER: Record<string, string> = {
    cost: "-",
    income: "+",
    exchange: "=",
  }
  // ─────────────────────────────────────────────────────────
  // FUNCTIONS DEFINITION
  // ─────────────────────────────────────────────────────────
  function retrieveUrlFromTransaction(transaction: Transaction): string {
    switch (transaction.operation) {
      case "cost":
        return `/transactions/costs/${transaction.id}`
      case "income":
        return `/transactions/incomes/${transaction.id}`
      case "exchange":
        return `/transactions/exchange/${transaction.id}`
      default:
        throw new Error(`Can't get URL from ${transaction}`)
    }
  }
  const groupedHistoryItems = $derived(
    groupTransactionsByDate(transactionsHistory!)
  )
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <main class="flex gap-10">
    <div class="flex flex-col gap-10">
      <Box title="🏦 Equity">
        <div class="flex flex-col items-center gap-2">
          {#each equities! as item}
            <a href="/" class="cursor-pointer hover:text-emerald-500"
              >{prettyMoney(item.equity)} {item.currency.sign}</a
            >
          {/each}
        </div>
      </Box>

      <Box title="🔘 Actions">
        <div class="flex flex-col gap-5">
          <Button
            color="blue"
            title="Exchange"
            onclick={() => {
              goto("/transactions/exchange")
            }}
          />
          <Button
            color="green"
            title="Income"
            onclick={() => {
              goto("/transactions/incomes")
            }}
          />
          <Button
            color="red"
            title="Cost"
            onclick={() => {
              goto("/transactions/costs")
            }}
          />
        </div>
      </Box>
    </div>
    <Box title="📊 Shortcuts" width={120}>
      <div class="flex flex-wrap gap-3 content-center">
        {#each costShortcuts! as shortcut}
          <CostShortcutComponent
            shortcutId={shortcut.id}
            value={shortcut.value}
          >
            <h2>{shortcut.name}</h2>
            <p class="mb-2 italic text-sm">{shortcut.category.name}</p>
            <p>
              {shortcut.value ? prettyMoney(shortcut.value) : "..."}
              {shortcut.currency.sign}
            </p>
          </CostShortcutComponent>
        {/each}
        <button
          type="button"
          class="border-2 p-2 w-32 rounded-md italic text-sm hover:bg-emerald-800 cursor-pointer"
          onclick={async () => {
            goto("/transactions/costs/shortcuts")
          }}>Add Cost Shortcut</button
        >
      </div>
    </Box>
    <Box title="📝 History" width={120}>
      <div class="flex flex-col gap-2 text-sm text-gray-300">
        {#each Object.entries(groupedHistoryItems) as aggregatedItem}
          <div
            class="py-1 font-semibold text-gray-400 border-b border-gray-600"
          >
            {aggregatedItem[0]}
          </div>
          {#each aggregatedItem[1] as transaction}
            <a
              href={retrieveUrlFromTransaction(transaction)}
              class="hover:text-gray-100 flex justify-between"
            >
              <div class="flex justify-between w-full gap-5">
                <p class="grow">
                  {`${TRANSACTION_OPERATIONS_MAPPER[transaction.operation]} ${transaction.name}`}
                </p>
                <p>{prettyMoney(transaction.value)}{transaction.currency}</p>
                <p class="text-gray-500">{transaction.user}</p>
              </div>
            </a>
          {/each}
          <div class="mt-3"></div>
        {/each}
      </div>
    </Box>
  </main>
{/if}
