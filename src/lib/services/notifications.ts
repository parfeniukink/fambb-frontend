import toast from "svelte-french-toast"

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
    position: duration < 3000 ? "top-right" : "bottom-right",
    duration: duration,
    style: "opacity: 0.7",
  })
}
