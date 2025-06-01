import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, loadEnv } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const allowedHost = env.VITE_ALLOWED_HOST

  return {
    preview: {
      allowedHosts: [allowedHost],
    },
    plugins: [sveltekit(), tailwindcss()],
  }
})
