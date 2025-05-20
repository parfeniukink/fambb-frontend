<script lang="ts">
  let {
    children,
    onclick,
  }: {
    children: CallableFunction
    onclick: any
  } = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<main
  class={`flex flex-col gap-1 border-2 rounded-md w-32 p-2 pb-8 text-center hover:bg-orange-900 cursor-pointer`}
  {onclick}
>
  {@render children()}
</main>
