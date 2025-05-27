<script lang="ts">
  import { STYLES } from "$lib/constants"

  let { value = $bindable(), width = 0 }: { value: any; width?: number } =
    $props()
</script>

<input
  type="date"
  bind:value
  class={`px-8 py-3 outline-none border-3 rounded-md ${STYLES.width[width]}`}
/>
