<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import CostShortcutComponent from "$lib/components/CostShortcut.svelte"

  import type {
    Transaction,
    CostShortcut,
    Currency,
    Equity,
  } from "$lib/types/money"

  import { prettyMoney } from "$lib/services/finances"
  import { goto } from "$app/navigation"

  const CURRENCIES: Currency[] = [
    {
      id: 1,
      name: "USD",
      sign: "$",
    },
    {
      id: 2,
      name: "UAH",
      sign: "₴",
    },
  ]

  const equity: Equity[] = [
    {
      equity: 10000,
      currency: {
        id: 1,
        name: "USD",
        sign: "$",
      },
    },
    {
      equity: 25000,
      currency: {
        id: 2,
        name: "UAH",
        sign: "₴",
      },
    },
  ]

  const costShortcuts: CostShortcut[] = [
    {
      id: 1,
      name: "Water",
      value: null,
      currency: {
        id: 1,
        name: "USD",
        sign: "$",
      },
      category: {
        id: 1,
        name: "Food",
      },
    },
    {
      id: 2,
      name: "Subway",
      value: 12,
      currency: {
        id: 2,
        name: "UAH",
        sign: "₴",
      },
      category: {
        id: 3,
        name: "Traveling",
      },
    },
    {
      id: 3,
      name: "Lunch",
      value: null,
      currency: {
        id: 2,
        name: "UAH",
        sign: "₴",
      },
      category: {
        id: 2,
        name: "Restaurants",
      },
    },
    {
      id: 4,
      name: "Coach",
      value: 30,
      currency: {
        id: 1,
        name: "USD",
        sign: "$",
      },
      category: {
        id: 5,
        name: "Services",
      },
    },
    {
      id: 5,
      name: "Fuel",
      value: 100,
      currency: {
        id: 1,
        name: "USD",
        sign: "$",
      },
      category: {
        id: 4,
        name: "Fuel",
      },
    },
  ]

  const historyItems: Transaction[] = [
    {
      id: 1,
      name: "Water",
      operation: "cost",
      value: 10,
      currency: "$",
      user: "john",
    },
    {
      id: 2,
      name: "Subway",
      operation: "cost",
      value: 12,
      currency: "$",
      user: "marry",
    },
    {
      id: 3,
      name: "Fuel",
      operation: "cost",
      value: 100,
      currency: "$",
      user: "john",
    },
    {
      id: 4,
      name: "Office",
      operation: "income",
      value: 1000,
      currency: "$",
      user: "john",
    },
    {
      id: 5,
      name: "Currency Exchange",
      operation: "exchange",
      value: 50,
      currency: "$",
      user: "marry",
    },
  ]

  const TRANSACTION_OPERATIONS_MAPPER: Record<string, string> = {
    cost: "-",
    income: "+",
    exchange: "=",
  }
</script>

<main class="flex gap-10">
  <div class="flex flex-col gap-10">
    <Box title="🏦 Equity">
      <div class="flex flex-col items-center gap-2">
        {#each equity as item}
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
      {#each costShortcuts as shortcut}
        <CostShortcutComponent shortcutId={shortcut.id} value={shortcut.value}>
          <h2 class="underline">{shortcut.name}</h2>
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
      {#each historyItems as item}
        <a href="/" class="hover:text-gray-100 flex justify-between">
          <p>
            {`${TRANSACTION_OPERATIONS_MAPPER[item.operation]} ${item.name} ── ${prettyMoney(item.value)}${item.currency}`}
          </p>
          <p>{item.user}</p>
        </a>
        <hr class="" />
      {/each}
    </div>
  </Box>
</main>
