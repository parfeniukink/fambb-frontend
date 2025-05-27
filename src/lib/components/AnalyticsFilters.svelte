<script lang="ts">
  import Button from "./Button.svelte"
  import DateSelection from "./DateSelection.svelte"

  let {
    startDate = $bindable(),
    endDate = $bindable(),
    searchPattern = $bindable(),
    onClick,
    width = 0,
  }: {
    startDate: any
    endDate?: any
    searchPattern?: any
    onClick: any
    width?: number
  } = $props()
</script>

<section
  class="flex flex-col justify-center items-center text-center gap-3 border border-1 border-gray-500 rounded-lg p-10"
>
  <DateSelection bind:value={startDate} />
  <DateSelection bind:value={endDate} />
  <input
    type="text"
    bind:value={searchPattern}
    placeholder="pattern..."
    class="w-full border border-3 border-gray-200 px-8 py-3 rounded-lg"
  />
  <Button title="add" onclick={onClick} color="green" />
</section>
