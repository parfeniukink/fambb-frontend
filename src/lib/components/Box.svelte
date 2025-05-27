<script lang="ts">
  let {
    children,
    title,
    width = 0,
    border = 3,
    padding = "default",
    actionItemIcon = null,
    actionItemCallback = null,
  }: {
    children: CallableFunction
    title: string
    width?: number
    border?: number
    padding?: string
    actionItemIcon?: string | null
    actionItemCallback?: any
  } = $props()

  const STYLES: Record<string, Record<string, string>> = {
    width: {
      0: "w-full",
      64: "w-64",
      76: "w-76",
      100: "w-100",
      120: "w-120",
      180: "w-180",
      240: "w-240",
    },
    border: {
      1: "border-1",
      2: "border-2",
      3: "border-3",
      4: "border-4",
    },
    padding: {
      default: "p-8",
      lg: "px-32 py-24",
    },
  }
</script>

<main
  class={`flex flex-col gap-10 ${STYLES.padding[padding]} rounded-xl ${STYLES.width[width]} ${STYLES.border[border]}`}
>
  {#if actionItemIcon && actionItemCallback}
    <div class="flex justify-between">
      <h1 class="font-bold text-xl">{title}</h1>
      <h1
        class="font-bold text-xl hover:cursor-pointer"
        onclick={actionItemCallback}
      >
        {actionItemIcon}
      </h1>
    </div>
  {:else}
    <h1 class="font-bold text-xl">{title}</h1>
  {/if}
  {@render children()}
</main>
