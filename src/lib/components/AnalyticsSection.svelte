<script lang="ts">
  import { persistent } from "$lib/data/persistent.svelte"
  import { prettyMoney } from "$lib/services/finances"
  import type {
    AnalyticsPeriod,
    TransactionsBasicAnalytics,
  } from "$lib/types/analytics"
  import type { Currency } from "$lib/types/money"

  const isMobile = persistent.mobileDevice

  let {
    title,
    analytics,
    period,
  }: {
    title: string
    analytics: TransactionsBasicAnalytics[]
    period: AnalyticsPeriod
  } = $props()

  const DETAILED_TRANSACTIONS_PAGE_URL = "/transactions"

  // build the URL to make the specific API call to fetch transactions
  function detailAnalyticsUrlForCosts(
    currency: Currency | null = null,
    costCategoryId: number | null = null
  ): string {
    let urlParticles: string[] = [
      DETAILED_TRANSACTIONS_PAGE_URL,
      `?period=${period}&operation=cost`,
    ]

    if (currency) urlParticles.push(`&currencyId=${currency.id}`)
    if (costCategoryId) urlParticles.push(`&costCategoryId=${costCategoryId}`)

    return urlParticles.join("")
  }

  function detailAnalyticsUrlForIncomes(): string {
    let urlParticles: string[] = [
      DETAILED_TRANSACTIONS_PAGE_URL,
      `?period=${period}&operation=income`,
    ]

    return urlParticles.join("")
  }

  function detailAnalyticsUrlForExchange(): string {
    let urlParticles: string[] = [
      DETAILED_TRANSACTIONS_PAGE_URL,
      `?period=${period}&operation=exchange`,
    ]

    return urlParticles.join("")
  }
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
      <a
        href={item.costs.total ? detailAnalyticsUrlForCosts(item.currency) : ""}
      >
        <div
          class={`${item.incomes.total ? "bg-amber-950 py-1" : ""} flex justify-between`}
        >
          <p class="text-[#d68f97]">costs:</p>
          <p>
            {prettyMoney(item.costs.total)}
            {item.currency.sign}
          </p>
        </div>
      </a>
      <a href={item.incomes.total ? detailAnalyticsUrlForIncomes() : ""}>
        <div
          class={`${item.incomes.total ? "bg-green-900 py-1" : ""} flex justify-between`}
        >
          <p class="text-[#caf492]">incomes:</p>
          <p>
            {prettyMoney(item.incomes.total)}
            {item.currency.sign}
          </p>
        </div>
      </a>
      <a href={item.fromExchanges ? detailAnalyticsUrlForExchange() : ""}>
        <div
          class={`${item.fromExchanges ? "bg-sky-950 py-1" : ""} flex justify-between`}
        >
          <p class="text-[#9bdce8]">currency exchange:</p>
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
      </a>
      <div
        class={`flex justify-between py-1 ${item.totalRatio < 100 ? "bg-green-700" : "bg-red-900"}`}
      >
        <p>total ratio:</p>
        <p>{item.totalRatio} %</p>
      </div>

      {#if item.costs.categories}
        <br />
        {#each item.costs.categories as category}
          <a href={detailAnalyticsUrlForCosts(item.currency, category.id)}>
            <div class="flex justify-between">
              <p>{category.name}</p>
              <p class="text-gray">
                {prettyMoney(category.total)}
                {item.currency.sign}
                <i class="text-gray-500">({category.ratio}%)</i>
              </p>
            </div>
          </a>
        {/each}
      {/if}
    </div>
  {/each}

  {#if isMobile}
    <hr class="my-10 border-solid" />
  {/if}
</section>
