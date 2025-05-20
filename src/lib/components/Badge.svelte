<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements"

  const {
    onclick,
    content,
    color = "transparent",
    styles,
  }: {
    onclick: MouseEventHandler<HTMLButtonElement>
    content: string
    color?: string
    styles?: string
  } = $props()

  const stylesMapping: Record<string, Record<string, string>> = {
    color: {
      red: "bg-orange-800",
      green: "bg-emerald-800",
      blue: "bg-sky-800",
      transparent: "transparent",
    },
  }
</script>

<button
  type="button"
  class={styles ??
    `px-12 h-[40px] min-w-[150px] overflow-hidden border rounded-xl cursor-pointer ${stylesMapping["color"][color]} hover:bg-orange-800`}
  {onclick}>{content}</button
>
