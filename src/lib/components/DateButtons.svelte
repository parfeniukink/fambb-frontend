<script lang="ts">
  // TODAY, YESTERDAY, 2 DAYS AGO BUTTONS
  let { value = $bindable() }: { value: any } = $props()

  const DATE_BUTTON_STYLES =
    "text-gray-400 hover:cursor-pointer hover:underline"

  function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10)
  }
  function daysFromToday(daysAgo: number) {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    value = formatDate(d)
  }
</script>

<div class="flex justify-around mb-2 w-full">
  <button
    type="button"
    class={DATE_BUTTON_STYLES}
    onclick={() => daysFromToday(2)}
  >
    -2 days
  </button>
  <button
    type="button"
    class={DATE_BUTTON_STYLES}
    onclick={() => daysFromToday(1)}
  >
    yesterday
  </button>
  <button
    type="button"
    class={DATE_BUTTON_STYLES}
    onclick={() => daysFromToday(0)}
  >
    today
  </button>
</div>
