<script lang="ts">
  import { onMount } from "svelte";
  import { formatAmount } from "../../../services";
  import { fetchTransactions } from "../../../data/requests";
  import type { Transaction } from "../../../data/types";
  import { page } from "$app/stores";

  $: currencyId = $page.url.searchParams.get("currencyId");

  let transactions: Record<string, Transaction[]> = {};
  let isLoading = true;
  let context = 0;
  let left = 0;

  function endRoute(transaction: Transaction) {
    if (transaction.operation === "cost") {
      return `/costs/${transaction.id.toString()}`;
    } else if (transaction.operation === "income") {
      return `/incomes/${transaction.id.toString()}`;
    } else if (transaction.operation === "exchange") {
      return `/exchange/${transaction.id.toString()}`;
    } else {
      throw Error(
        `Unrecognized transaction operation: ${transaction.operation}`,
      );
    }
  }

  onMount(async () => {
    await loadTransactions();
  });

  const loadTransactions = async () => {
    const result = await fetchTransactions({
      currencyId: Number(currencyId),
      context: context,
    });

    if (result) {
      for (const item of result.result) {
        const timestamp = item.timestamp.toString();
        if (!transactions[timestamp]) {
          transactions[timestamp] = []; // Initialize array if it doesn't exist
        }
        transactions[timestamp].push(item); // Add the transaction to the respective timestamp group
      }

      context = result.context;
      left = result.left;
    }
    isLoading = false;
  };
</script>

<div class="container">
  {#if isLoading}
    <p>loading...</p>
  {:else}
    <div class="transactions">
      {#each Object.keys(transactions) as timestamp}
        <div class="timestamp-group">
          <!-- Display the timestamp  -->
          <h3>[ {timestamp} ]</h3>
          <!-- Display each transaction in the block  -->
          {#each transactions[timestamp] as transaction}
            <a href={endRoute(transaction)}
              ><p class={transaction.operarion}>
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
                  <span class="username"
                    >by {transaction.user.toLowerCase()}</span
                  >
                </span>
              </p>
            </a>
          {/each}
        </div>
      {/each}
    </div>
    {#if left > 0}
      <button on:click={() => loadTransactions()}>load more...</button>
    {/if}
  {/if}
</div>

<style>
  .transactions {
    display: flex;
    flex-direction: column;
    justify-content: left;
    color: white;
  }

  p {
    color: white;
  }

  button {
    width: 100%;
    margin: 50px auto;
    text-align: right;
    background: none;
    border: none;
    color: #b29849;
  }

  .cost {
    color: #d68f97;
  }
  .income {
    color: #caf492;
  }
  .exchange {
    color: #9bdce8;
  }
  .timestamp-group h3 {
    margin-top: 50px;
    color: #a07a60;
  }
  .money {
    margin-left: 10px;
  }
  .username {
    font-style: italic;
    font-size: x-small;
    color: gray;
    margin-left: 20px;
  }
</style>
