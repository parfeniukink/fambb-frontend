<script lang="ts">
  import { STYLES } from "$lib/constants"

  let {
    children,
    title,
    titleCenter = false,
    width = 0,
    border = 3,
    padding = "default",
    actionItemIcon = null,
    actionItemCallback = null,
  }: {
    children: CallableFunction
    title: string
    titleCenter?: boolean
    width?: number
    border?: number
    padding?: string
    actionItemIcon?: string | null
    actionItemCallback?: any
  } = $props()
</script>

<main
  class={`flex flex-col gap-10 ${STYLES.padding[padding]} rounded-xl ${STYLES.width[width]} ${STYLES.border[border]}`}
>
  {#if actionItemIcon && actionItemCallback}
    <div
      class={`flex justify-between ${titleCenter ? "text-center" : "text-left"}`}
    >
      <h1 class="font-bold text-xl">
        {title}
      </h1>
      <h1
        class="font-bold text-xl hover:cursor-pointer"
        onclick={actionItemCallback}
      >
        {actionItemIcon}
      </h1>
    </div>
  {:else}
    <h1
      class={`font-bold text-xl ${titleCenter ? "text-center" : "text-left"}`}
    >
      {title}
    </h1>
  {/if}
  {@render children()}
</main>
