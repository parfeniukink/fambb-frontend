<script lang="ts">
  let {
    children,
    shortcutId,
    value,
  }: {
    children: CallableFunction
    shortcutId: number
    value: number | null
  } = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<main
  class={`flex flex-col gap-1 border-2 rounded-md w-32 p-2 text-center hover:bg-orange-900 cursor-pointer`}
  onclick={async () => {
    console.log(`Cost Shortcut ${shortcutId} ${value}`)
  }}
>
  {@render children()}
</main>
