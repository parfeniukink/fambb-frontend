<script lang="ts">
  import { onMount } from "svelte";
  import Section from "../../components/Section.svelte";
  import { formatAmount } from "../../services";
  import {
    getBasicAnalytics,
    getBasicAnalyticsFiltered,
  } from "../../data/requests";
  import type {
    TransactionBasicAnalytics,
    ResponseMulti,
  } from "../../data/types";
  import { FiltersStore } from "../../data/types";
  import { writable } from "svelte/store";

  let errorMessage: string | null = $state(null);
  let selectedRangeErrorMessage: string | null = $state(null);

  let currentMonthBasicAnalytics: TransactionBasicAnalytics[] = $state([]);
  let previousMonthBasicAnalytics: TransactionBasicAnalytics[] = $state([]);
  let customRangeBasicAnalytics: TransactionBasicAnalytics[] = $state([]);

  // for seding requests for the basic analytics
  let filtersStore = writable(new FiltersStore());

  onMount(async () => {
    const response: ResponseMulti<TransactionBasicAnalytics>[] =
      await Promise.all([
        getBasicAnalytics("current-month"),
        getBasicAnalytics("previous-month"),
      ]);

    if (response) {
      currentMonthBasicAnalytics = response[0].result;
      previousMonthBasicAnalytics = response[1].result;
    } else {
      errorMessage = "no basic analytics";
    }
  });

  async function handleFetchBasicAnalytics() {
    try {
      const response: ResponseMulti<TransactionBasicAnalytics> =
        await getBasicAnalyticsFiltered(
          $filtersStore.startDate,
          $filtersStore.endDate,
          $filtersStore.pattern,
        );
      customRangeBasicAnalytics = response.result;
      selectedRangeErrorMessage = null;
    } catch (e) {
      selectedRangeErrorMessage = e.message;
    }
  }
</script>

<div class="analyticsPage">
  <Section title={"📊 current month"}>
    {#each currentMonthBasicAnalytics as item}
      <h4>[ {item.currency.name} ]</h4>
      <hr />
      <div class="container">
        <div class="summary">
          <div class="summary-left">
            <p class="summary-item red-text">costs:</p>
            <p class="summary-item green-text">incomes:</p>
            <p class="summary-item blue-text">currency exchange:</p>
            <p class="summary-item bold-text">total ratio:</p>
            {#if item.costs.categories}
              <br />
            {/if}
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
  <Section title={"📊 previous month"}>
    {#each previousMonthBasicAnalytics as item}
      <h4>[ {item.currency.name} ]</h4>
      <hr />
      <div class="container">
        <div class="summary">
          <div class="summary-left">
            <p class="summary-item red-text">costs:</p>
            <p class="summary-item green-text">incomes:</p>
            <p class="summary-item blue-text">currency exchange:</p>
            <p class="summary-item bold-text">total ratio:</p>
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
  <Section title={"📊 select range"}>
    <div class="customDatesRange">
      <input
        id="startDate"
        class="inputDate"
        type="date"
        bind:value={$filtersStore.startDate}
      />
      <input
        id="endDate"
        class="inputDate"
        type="date"
        bind:value={$filtersStore.endDate}
      />
    </div>
    <div class="patternInput">
      <input
        id="pattern"
        class="inputPattern"
        type="text"
        bind:value={$filtersStore.pattern}
        placeholder="search..."
      />
    </div>
    <button class="submitButton" onclick={handleFetchBasicAnalytics}
      >fetch</button
    >

    {#if selectedRangeErrorMessage}
      <p class="red-text">{selectedRangeErrorMessage}</p>
    {/if}

    {#each customRangeBasicAnalytics as item}
      <h4>[ {item.currency.name} ]</h4>
      <hr />
      <div class="container">
        <div class="summary">
          <div class="summary-left">
            <p class="summary-item red-text">costs:</p>
            <p class="summary-item green-text">incomes:</p>
            <p class="summary-item blue-text">currency exchange:</p>
            <p class="summary-item bold-text">total ratio:</p>
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
  <br />
</div>

<style>
  p {
    margin: auto 0;
    text-align: left;
  }
  i {
    font-style: italic;
    color: gray;
  }

  button {
    padding: 15px 40px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #2c7bb7;
  }

  .analyticsPage {
    align-items: center;
    padding: 10px;
  }

  .container {
    display: flex;
    flex-direction: column;
    margin: 30px auto;
  }

  .summary {
    display: flex;
    gap: 30px;
  }
  .red-text {
    color: #d68f97;
  }
  .green-text {
    color: #caf492;
  }
  .blue-text {
    color: #9bdce8;
  }
  .bold-text {
    font-weight: bold;
  }
  .analyticsPage {
    align-items: center;
    padding: 10px;
  }

  .customDatesRange {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 10px;
  }

  .inputDate {
    border: 0px solid #ccc; /* Add border for visibility */
    border-radius: 4px; /* Rounded corners */
    height: 40px;
    font-size: small;
  }

  .submitButton {
    margin-bottom: 20px;
    padding: 10px 20px; /* Adjust padding */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #caf492;
    color: #474747;
    width: 100%;
  }
</style>
