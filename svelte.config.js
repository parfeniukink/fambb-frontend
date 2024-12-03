import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess({
    typescript: true,
  }),
  kit: {
    adapter: adapter(),
    files: {
      lib: "./src/",
    },
  },
};
