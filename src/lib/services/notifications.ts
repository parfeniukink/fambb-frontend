import toast from "svelte-french-toast"

export async function notification(
  message: string,
  icon: string = "🔔",
  duration: number = 2000 // 2 seconds
): Promise<void> {
  toast(message, {
    icon: icon,
    position: duration < 3000 ? "top-right" : "bottom-center",
    duration: duration,
    style: "opacity: 0.7",
  })
}
