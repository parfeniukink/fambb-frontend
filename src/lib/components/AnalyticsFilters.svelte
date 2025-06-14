<script lang="ts">
  import Button from "./Button.svelte"
  import DateSelection from "./DateSelection.svelte"
  import { persistent } from "$lib/data/persistent.svelte"

  const isMobile = persistent.mobileDevice

  let {
    startDate = $bindable(),
    endDate = $bindable(),
    searchPattern = $bindable(),
    onClick,
  }: {
    startDate: any
    endDate?: any
    searchPattern?: any
    onClick: any
    width?: number
  } = $props()

  const sectionDynamicStyles = isMobile
    ? ""
    : "border-1 border-gray-500 rounded-lg"
</script>

<section
  class={`flex flex-col justify-center items-center text-center gap-3 p-10 ${sectionDynamicStyles}`}
>
  <DateSelection bind:value={startDate} />
  <DateSelection bind:value={endDate} />
  <input
    type="text"
    bind:value={searchPattern}
    placeholder="pattern..."
    class="w-full border-3 border-gray-200 px-8 py-3 rounded-lg"
  />
  <Button title="add" onclick={onClick} color="green" />
</section>
