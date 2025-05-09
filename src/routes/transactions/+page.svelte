<script lang="ts">
  import { page } from "$app/state"
  import { transactionsList, userLogin } from "$lib/data/api"
  import type { Transaction } from "$lib/types/money"
  import type { User } from "$lib/types/user"

  const currencyId: string | null = page.url.searchParams.get("currencyId")

  // the current representation of transactions
  let transactionsByDates: Record<string, Transaction[]> = $state(
    {} as Record<string, Transaction[]>
  )
  let transactionByDatesFiltered: Record<string, Transaction[]> = $derived.by(
    () => {
      if (showOnlyMine) {
        console.log("updated")
        return Object.fromEntries(
          Object.entries(transactionsByDates)
            .map(([date, transactions]) => [
              date,
              transactions.filter((transaction) => {
                return (
                  transaction.user.toLowerCase() === "john" // todo: change mocked user
                )
              }),
            ])
            .filter(([, _transactions]) => _transactions.length > 0)
        )
      } else {
        return transactionsByDates
      }
    }
  )

  // Pagination definition
  let context: number = $state(0)
  let left: number = $state(0)
  let limit: number = $state(10)

  let showOnlyMine: boolean = $state(false)

  // dispatch the end of the link, based on the transaction information.
  // depends on transaction type we redirect to the recpective page
  function endRoute(transaction: domain.Transaction) {
    if (transaction.operation === "cost") {
      return `/transactions/costs/${transaction.id.toString()}`
    } else if (transaction.operation === "income") {
      return `/transactions/incomes/${transaction.id.toString()}`
    } else if (transaction.operation === "exchange") {
      return `/transactions/exchange/${transaction.id.toString()}`
    } else {
      throw Error(
        `Unrecognized transaction operation: ${transaction.operation}`
      )
    }
  }

  onMount(async () => {
    if (currencyId != null) {
      await loadTransactions()
    } else {
      goto("/")
    }
  })

  const loadTransactions = async () => {
    const response: ResponseMultiPaginated<domain.Transaction> =
      await dataProxy.fetchTransactions({
        currencyId: Number(currencyId),
        context: context,
        limit: limit,
      })

    if (transactionsByDates) {
      for (const item of response.result) {
        const timestamp = item.timestamp.toString()

        if (!transactionsByDates[timestamp]) {
          transactionsByDates[timestamp] = [] // Initialize array if it doesn't exist
        }
        transactionsByDates[timestamp].push(item) // Add the transaction to the respective timestamp group
      }

      context = response.context
      left = response.left
    }
  }
</script>

<main>
  <section id="settings">
    <div>
      <p>pagination limit</p>
      <input
        id="paginationLimitSetting"
        type="text"
        inputmode="numeric"
        pattern="\d*"
        bind:value={limit}
      />
    </div>

    <div>
      <p>only mine</p>
      <input
        id="showOnlyMineSetting"
        type="checkbox"
        bind:checked={showOnlyMine}
      />
    </div>
  </section>
  <hr />
  <section>
    {#each Object.keys(transactionByDatesFiltered) as timestamp}
      <div class="timestampGroup">
        <!-- Display the timestamp  -->
        <h1>[ {timestamp} ]</h1>
        <!-- Display each transaction in the block  -->
        {#each transactionByDatesFiltered[timestamp] as transaction}
          <a href={endRoute(transaction)}
            ><p class={transaction.operation}>
              {#if transaction.operation === "cost"}
                -
              {:else if transaction.operation === "income"}
                +
              {:else if transaction.operation === "exchange"}
                =
              {/if}
              {transaction.name}
              <span class="money">
                {formatAmount(transaction.value)}
                {transaction.currency}
                <span class="username">by {transaction.user.toLowerCase()}</span
                >
              </span>
            </p>
          </a>
        {/each}
      </div>
    {/each}
  </section>
  <section id="navigation">
    {#if left > 0}
      <button id="loadMoreButton" onclick={loadTransactions}
        >load more...</button
      >
    {/if}
  </section>
</main>
