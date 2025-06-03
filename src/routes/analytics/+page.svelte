<script lang="ts">
  import AnalyticsFilters from "$lib/components/AnalyticsFilters.svelte"
  import AnalyticsSection from "$lib/components/AnalyticsSection.svelte"
  import {
    fetchBasicAnalyticsByPeriod,
    fetchBasicAnalyticsFiltered,
  } from "$lib/data/api"
  import { persistent } from "$lib/data/persistent.svelte"
  import { notification } from "$lib/services/notifications"
  import type { TransactionsBasicAnalytics } from "$lib/types/analytics"
  import { onMount } from "svelte"

  const isMobile = persistent.mobileDevice

  // just an error message to be displayed
  let errorMessage: string | null = $state(null)

  // transaction UI state
  let currentMonthBasicAnalytics: TransactionsBasicAnalytics[] = $state([])
  let previousMonthBasicAnalytics: TransactionsBasicAnalytics[] = $state([])

  // {"periodA": [...], "periodB": [...]}
  let customRangeBasicAnalytics: Record<string, TransactionsBasicAnalytics[]> =
    $state({})

  // for seding requests for the basic analytics
  class Filters {
    startDate: string | null = $state(null)
    endDate: string = $state(new Date().toISOString().slice(0, 10))
    pattern: string | null = $state(null)
  }
  let filters = $derived(new Filters())

  onMount(async () => {
    const [currentMonth, previousMonth] = await Promise.all([
      fetchBasicAnalyticsByPeriod("current-month"),
      fetchBasicAnalyticsByPeriod("previous-month"),
    ])

    if (currentMonth) currentMonthBasicAnalytics = currentMonth
    if (previousMonth) previousMonthBasicAnalytics = previousMonth
    if (!previousMonth && !currentMonth) errorMessage = "no basic analytics"
  })

  async function handleFetchBasicAnalyticsForCustomRange() {
    if (!filters.startDate || !filters.endDate) {
      notification({
        message: "'start' and 'end' dates must be specified",
        icon: "⚠️",
      })
      return
    }

    try {
      const response = await fetchBasicAnalyticsFiltered(filters)
      const title = filters.pattern
        ? `${filters.startDate} - ${filters.endDate}, ${filters.pattern}`
        : `${filters.startDate} - ${filters.endDate}`
      customRangeBasicAnalytics[title] = response
    } catch (e) {
      console.error(e)
    }
  }
</script>

<div
  class={isMobile
    ? "flex-col"
    : "flex justify-start items-start gap-5 p-[10px]"}
>
  <AnalyticsSection
    title={"📊 current month"}
    analytics={currentMonthBasicAnalytics}
    period="current-month"
  />
  <AnalyticsSection
    title={"📊 previous month"}
    analytics={previousMonthBasicAnalytics}
    period="previous-month"
  />

  {#each Object.entries(customRangeBasicAnalytics) as [timestamp, analytics]}
    <AnalyticsSection
      title={`📊 ${timestamp}`}
      {analytics}
      period={timestamp}
    />
  {/each}

  <AnalyticsFilters
    bind:startDate={filters.startDate}
    bind:endDate={filters.endDate}
    bind:searchPattern={filters.pattern}
    onClick={handleFetchBasicAnalyticsForCustomRange}
  />
  {#if isMobile}
    <div class="mb-20"></div>
  {/if}
  <div></div>
</div>
