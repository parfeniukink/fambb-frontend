<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import CostShortcutComponent from "$lib/components/CostShortcut.svelte"

  import type { Transaction, CostShortcut, Currency } from "$lib/types/money"

  import { prettyMoney } from "$lib/services/finances"

  const currencies: Currency[] = [
    {
      id: 1,
      name: "USD",
      sign: "$",
      equity: 10000,
    },
    {
      id: 2,
      name: "UAH",
      sign: "#",
      equity: 20000,
    },
  ]

  const costShortcuts: CostShortcut[] = [
    {
      id: 1,
      name: "Water",
      value: null,
      currency: {
          id: ...
      },
      category: "Food",
    },
    {
      id: 2,
      name: "Subway",
      value: 12,
      currency: "$",
      category: "Roads",
    },
    {
      id: 3,
      name: "Lunch",
      value: null,
      currency: "$",
      category: "Restaurants",
    },
    {
      id: 4,
      name: "Coach",
      value: 30,
      currency: "$",
      category: "Services",
    },
    {
      id: 5,
      name: "Fuel",
      value: 100,
      currency: "$",
      category: "Car",
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
        {#each currencies as currency}
          <a href="/" class="cursor-pointer hover:text-emerald-500"
            >{prettyMoney(currency.equity)} {currency.sign}</a
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
            console.log("clicked exchange")
          }}
        />
        <Button
          color="green"
          title="Income"
          onclick={() => {
            console.log("clicked income")
          }}
        />
        <Button
          color="red"
          title="Cost"
          onclick={() => {
            console.log("clicked cost")
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
          <p class="mb-2 italic text-sm">{shortcut.category}</p>
          <p>
            {shortcut.value ? prettyMoney(shortcut.value) : "..."}
            {shortcut.currency}
          </p>
        </CostShortcutComponent>
      {/each}
      <button
        type="button"
        class="border-2 p-2 w-32 rounded-md italic text-sm hover:bg-emerald-800 cursor-pointer"
        onclick={async () => {
          console.log("redirect to create a cost shortcut")
        }}>Add Cost Shortcut</button
      >
    </div>
  </Box>
  <Box title="📝 History" width={120}>
    <div class="flex flex-col gap-2 text-sm text-gray-300">
      {#each historyItems as item}
        <a href="/" class="hover:text-orange-300">
          {`${TRANSACTION_OPERATIONS_MAPPER[item.operation]} ${item.name} ... ${prettyMoney(item.value)}${item.currency}  | ${item.user}`}
        </a>
        <hr class="" />
      {/each}
    </div>
  </Box>
</main>
