<script lang="ts">
  import { onMount } from "svelte";
  import { formatAmount } from "../services";
  import type { Transaction } from "../data/types";
  import { equityStore, lastTransactionsStore } from "../data/store";

  import { fetchEquity, fetchTransactions } from "../data/requests";
  import Section from "../components/Section.svelte";

  onMount(async () => {
    const results = await Promise.all([fetchEquity(), fetchTransactions({})]);

    equityStore.set(results[0]["result"]);
    lastTransactionsStore.set(results[1]["result"]);
  });

  function transactionRepr(transaction: Transaction): string {
    const message = `${transaction.name} ${formatAmount(transaction.value)}${transaction.currency}`;

    switch (transaction.operation) {
      case "cost": {
        return ["-", message].join(" ");
      }
      case "income": {
        return ["+", message].join(" ");
      }
      case "exchange": {
        return ["=", message].join(" ");
      }
      default: {
        throw Error(
          `Unrecoginzed transaction operation: ${transaction.operation}`,
        );
      }
    }
  }
</script>

<div class="homePage">
  <Section title="🏦 Equity">
    <div class="equityItems">
      {#if $equityStore}
        {#each $equityStore as equity}
          <a
            href="/analytics/transactions/?currencyId={equity.currency.id.toString()}"
          >
            {formatAmount(equity.amount)}
            {equity.currency.sign}
          </a>
        {/each}
      {:else}
        <p>loading...</p>
      {/if}
    </div>
  </Section>
  <Section title="📝 Last Transactions">
    <div class="lastTransactions">
      {#if $lastTransactionsStore}
        {#each $lastTransactionsStore as item}
          <p>
            {transactionRepr(item)} <span> by {item.user.toLowerCase()}</span>
          </p>
        {/each}
      {:else}
        <p>loading...</p>
      {/if}
    </div>
  </Section>
  <Section title="🏃‍♂️ Actions">
    <div class="quickActions">
      <a href="/costs" class="quickActionButton addCostButton">cost</a>
      <a href="/incomes" class="quickActionButton addIncomeButton">income</a>
      <a href="/exchange" class="quickActionButton addExchangeButton"
        >exchange</a
      >
    </div>
  </Section>
</div>

<style>
  /* General */
  .homePage {
    width: 100%;
    align-items: center;
    padding: 10px;
    margin-bottom: 100px;
  }

  /* Equity Section */
  .equityItems {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    gap: 30px;
    text-align: center;
    align-content: center;
  }
  .equityItems a {
    color: #a07a60;
    font-weight: bold;
  }

  /* Last Transactions Section */
  .lastTransactions {
    display: flex;
    flex-direction: column;
  }

  .lastTransactions p {
    margin: 3px 0;
  }

  .lastTransactions span {
    font-style: italic;
    font-size: x-small;
    color: gray;
    margin-left: 20px;
  }

  /* Quick Actions Section */
  .quickActions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .quickActionButton {
    padding: 20px;
    font-weight: normal;
    font-size: x-large;
    width: calc(100% - 50px);
    text-align: center;
    border-radius: 4px;
  }
  .addCostButton {
    background: #ba535f;
  }
  .addIncomeButton {
    background: #32c181;
  }
  .addExchangeButton {
    background: #2c7bb7;
  }
</style>
