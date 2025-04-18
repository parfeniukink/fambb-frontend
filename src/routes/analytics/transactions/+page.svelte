<script lang="ts">
  import { page } from "$app/state"
  import type { Transaction } from "$lib/types/money"

  const user: User = {}

  let context: number = $state(0)
  let left: number = $state(0)
  let limit: number = $state(10)

  // =====================================
  // ui state
  // =====================================

  // currency
  const _currencyId: string | null = $state(
    page.url.searchParams.get("currencyId")
  )
  const currencyId: Number | null = $derived(
    _currencyId ? Number(_currencyId) : null
  )

  // transactions
  let showOnlyMineTransactions: boolean = $state(false)

  let transactionsByDates: Record<string, Transaction[]> = $state(
    {} as Record<string, Transaction[]>
  )

  let transactionByDatesFiltered = $derived.by(() => {
    if (showOnlyMineTransactions) {
      return Object.fromEntries(
        Object.entries(transactionsByDates)
          .map(([date, transactions]) => [
            date,
            transactions.filter((transaction) => {
              return (
                transaction.user.toLowerCase() ===
                dataProxy.userState!.name.toLowerCase()
              )
            }),
          ])
          .filter(([, _transactions]) => _transactions.length > 0)
      )
    } else {
      return transactionsByDates
    }
  })
</script>

<main>
  {#if currencyId === null}
    <h1 class="text-center font-mono text-red-400 text-3xl underline italic">
      Currency is not specified. Get back to the DASHBOARD
    </h1>
  {:else}
    <p>Transactions</p>
  {/if}
</main>
