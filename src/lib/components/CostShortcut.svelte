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
  class={`flex flex-col justify-center border-2 rounded-md ${isMobile ? "py-8 hover:bg-orange-900 w-40" : "pb-4 px-2 hover:bg-orange-900 cursor-pointer w-32"} text-center`}
  {onclick}
>
  {@render children()}
</section>
