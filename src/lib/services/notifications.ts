import toast from "svelte-french-toast"
import { persistent } from "$lib/data/persistent.svelte"

export async function notification({
  message,
  icon = "🔔",
  duration = 2000,
}: {
  message: string
  icon?: string
  duration?: number
}): Promise<void> {
  toast(message, {
    icon: icon,
    position: persistent.mobileDevice
      ? "top-center"
      : duration < 3000
        ? "top-right"
        : "bottom-right",
    duration: duration,
    style: "opacity: 0.7",
  })
}
