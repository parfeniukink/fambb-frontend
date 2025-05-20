<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements"

  const {
    onclick,
    title,
    color,
    styles,
  }: {
    onclick: MouseEventHandler<HTMLButtonElement>
    title: string
    color: string
    styles?: string
  } = $props()

  const stylesMapping: Record<string, Record<string, string>> = {
    color: {
      red: "bg-orange-800",
      green: "bg-emerald-800",
      blue: "bg-sky-800",
    },
  }
</script>

<button
  type="button"
  class={styles ??
    `w-full px-4 py-4 rounded-lg cursor-pointer ${stylesMapping["color"][color]}`}
  {onclick}>{title}</button
>
