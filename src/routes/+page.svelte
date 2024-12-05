<script lang="ts">
  import { onMount } from "svelte";
  import { formatAmount } from "../services";
  import type { Transaction } from "../data/types";
  import { equityStore, lastTransactionsStore } from "../data/store";
  import Section from "../components/Section.svelte";
  import { fetchEquity, fetchTransactions } from "../data/requests";

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
          <p>{transactionRepr(item)}</p>
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
  @import "./page.css";
</style>
