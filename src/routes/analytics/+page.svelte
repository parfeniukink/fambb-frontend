<script lang="ts">
  import { onMount } from "svelte";
  import Section from "../../components/Section.svelte";
  import { formatAmount } from "../../services";
  import { getBasicAnalytics } from "../../data/requests";
  import type { TransactionBasicAnalytics, ResponseMulti } from "../../types";

  let errorMessage: string | null = $state(null);
  let basicAnalytics: TransactionBasicAnalytics[] = $state([]);

  onMount(async () => {
    const result: ResponseMulti<TransactionBasicAnalytics> | null =
      await getBasicAnalytics("current-month");

    if (result) {
      basicAnalytics = result.result;
      console.debug(basicAnalytics);
    } else {
      console.error("no basic analytics");
      errorMessage = "no basic analytics";
    }
  });
</script>

<div class="analyticsPage">
  <Section title={"📊 current month"}>
    {#each basicAnalytics as item}
      <div class="container">
        <div class="summary">
          <div class="summary-left">
            <p class="summary-item">costs:</p>
            <p class="summary-item">incomes:</p>
            <p class="summary-item">currency exchange:</p>
            <p class="summary-item">total ratio:</p>
            <br />
            {#each item.costs.categories as category}
              <p class="summary-item">{category.name}</p>
            {/each}
          </div>
          <div class="summary-right">
            <p class="summary-item">
              {formatAmount(item.costs.total)}
              {item.currency.sign}
            </p>
            <p class="summary-item">
              {formatAmount(item.incomes.total)}
              {item.currency.sign}
            </p>

            {#if item.fromExchanges > 0}
              <p class="summary-item">
                {`+ ${formatAmount(item.fromExchanges)} ${item.currency.sign}`}
              </p>
            {:else}
              <p class="summary-item">
                {`${formatAmount(item.fromExchanges)} ${item.currency.sign}`}
              </p>
            {/if}
            <p class="summary-item">{item.totalRatio} %</p>
            <br />

            {#each item.costs.categories as category}
              <p class="summary-item cost-category-total">
                {formatAmount(category.total)}
                {item.currency.sign} <i>({category.ratio}%)</i>
              </p>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </Section>
</div>

<style>
  .analyticsPage {
    align-items: center;
    padding: 10px;
  }

  p {
    margin: auto 0;
    text-align: left;
  }
  i {
    font-style: italic;
    color: gray;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin: 50px auto;
  }

  .summary {
    display: flex;
    gap: 70px;
  }
</style>
