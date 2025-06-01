<script lang="ts">
  import { persistent } from "$lib/data/persistent.svelte"
  import { prettyMoney } from "$lib/services/finances"
  import type { TransactionsBasicAnalytics } from "$lib/types/analytics"

  const isMobile = persistent.mobileDevice

  let {
    title,
    analytics,
  }: { title: string; analytics: TransactionsBasicAnalytics[] } = $props()
</script>

<section
  class={isMobile
    ? "px-2 text-sm"
    : "flex-col min-w-[500px] max-w-[700px]border-gray-600 border rounded-lg border-solid p-[2rem]"}
>
  <!-- TITLE -->
  <h1>{title}</h1>

  {#each analytics as item}
    <h1 class="mt-10 mb-2">[ {item.currency.name} ]</h1>

    <!-- DIVIDER -->
    <hr class="border-dashed w-1/2" />

    <!-- ITEMS -->
    <div class={isMobile ? "text-xs" : "text-sm"}>
      <div
        class={`${item.incomes.total ? "bg-amber-950 py-1" : ""} flex justify-between`}
      >
        <p class="red-text">costs:</p>
        <p>
          {prettyMoney(item.costs.total)}
          {item.currency.sign}
        </p>
      </div>
      <div
        class={`${item.incomes.total ? "bg-green-900 py-1" : ""} flex justify-between`}
      >
        <p class="green-text">incomes:</p>
        <p>
          {prettyMoney(item.incomes.total)}
          {item.currency.sign}
        </p>
      </div>
      <div
        class={`${item.fromExchanges ? "bg-sky-950 py-1" : ""} flex justify-between`}
      >
        <p class="blue-text">currency exchange:</p>
        {#if item.fromExchanges > 0}
          <p>
            {`+ ${prettyMoney(item.fromExchanges)} ${item.currency.sign}`}
          </p>
        {:else}
          <p>
            {`${prettyMoney(item.fromExchanges)} ${item.currency.sign}`}
          </p>
        {/if}
      </div>
      <div
        class={`flex justify-between py-1 ${item.totalRatio < 100 ? "bg-green-700" : "bg-red-900"}`}
      >
        <p>total ratio:</p>
        <p>{item.totalRatio} %</p>
      </div>

      {#if item.costs.categories}
        <br />
        <br />
      {/if}

      {#each item.costs.categories as category}
        <div class="flex justify-between">
          <p>{category.name}</p>
          <p class="text-gray">
            {prettyMoney(category.total)}
            {item.currency.sign}
            <i class="text-gray-500">({category.ratio}%)</i>
          </p>
        </div>
      {/each}
    </div>
  {/each}

  {#if isMobile}
    <hr class="my-10 border-solid" />
  {/if}
</section>

<style>
  .red-text {
    color: #d68f97;
  }
  .green-text {
    color: #caf492;
  }
  .blue-text {
    color: #9bdce8;
  }
</style>
