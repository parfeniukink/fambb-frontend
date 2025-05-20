<script lang="ts">
  import type { SelectionItem } from "$lib/types/money"

  let {
    value = $bindable(),
    items,
    cleanOnSelect = false,
    width = "full",
    onchangeCallback,
  }: {
    value: any
    items: SelectionItem[]
    cleanOnSelect?: boolean
    onchangeCallback?: CallableFunction
    width?: string
  } = $props()

  const STYLES: Record<string, Record<string, string>> = {
    width: {
      full: "w-full",
      "24": "w-24",
    },
  }
</script>

<main class="relative">
  <select
    bind:value
    class={`appearance-none px-8 py-3 outline-none border-3 rounded-md ${STYLES.width[width]} hover:cursor-pointer`}
    onchange={(
      event: Event & { currentTarget: EventTarget & HTMLSelectElement }
    ) => {
      onchangeCallback()
      if (cleanOnSelect) {
        const target = event.target as HTMLSelectElement
        target.value = ""
      }
    }}
  >
    {#if cleanOnSelect}
      <option selected value=""></option>
    {/if}
    {#each items as item}
      <option value={item.value}>{item.content}</option>
    {/each}
  </select>
  <svg
    class="absolute right-[0.5em] top-[50%] pointer-events-none fill-white w-[2rem] h-[2rem] translate-y-[-50%]"
    viewBox="0 0 24 24"
  >
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
</main>
