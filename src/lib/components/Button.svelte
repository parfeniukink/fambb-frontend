<script lang="ts">
  import { STYLES } from "$lib/constants"
  import type { MouseEventHandler } from "svelte/elements"

  const {
    onclick,
    title,
    color = "blue",
    size = "default",
    styles,
  }: {
    onclick: MouseEventHandler<HTMLButtonElement>
    title: string
    color?: string
    size?: "default" | "large"
    styles?: string
  } = $props()

  const buttonSizeStyles = size === "default" ? "px-4 py-4" : "px-4 py-8"
</script>

<button
  type="button"
  class={styles ??
    `w-full ${buttonSizeStyles} rounded-lg cursor-pointer ${STYLES.bgColor[color]}`}
  {onclick}>{title}</button
>
