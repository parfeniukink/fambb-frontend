<script lang="ts">
  import { persistent } from "$lib/data/persistent.svelte"
  const isMobile = persistent.mobileDevice

  let {
    children,
    onclick,
  }: {
    children: CallableFunction
    onclick: any
  } = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<section
  class={`flex flex-col justify-center border-2 rounded-md w-32 ${isMobile ? "p-4 hover:bg-orange-900" : "pb-4 px-2 hover:bg-orange-900 cursor-pointer"} text-center`}
  {onclick}
>
  {@render children()}
</section>
