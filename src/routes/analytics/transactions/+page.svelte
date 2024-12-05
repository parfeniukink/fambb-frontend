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

<div class="p-6">
  {#if isLoading}
    <div>loading...</div>
  {:else}
    <div class="transactions">
      {#each Object.keys(transactions) as timestamp}
        <div class="timestamp-group">
          <h3>[ {timestamp} ]</h3>
          <!-- Display the timestamp (or formatted date) -->
          {#each transactions[timestamp] as transaction}
            <p class={transaction.operation}>
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
    margin-top: 30px;
    margin-bottom: 170px;
    margin-right: 50px;
    width: 100%;
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
  }
</style>
