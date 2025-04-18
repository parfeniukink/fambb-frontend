<script lang="ts">
  let { children } = $props()
  import "../app.css"

  const NAV_LI_STYLES = "hover:underline hover:text-teal-600 cursor-pointer"
</script>

<div class="flex h-screen">
  <nav class="w-48 text-xl mt-20 text-center h-100">
    <h1 class="text-2xl italic">🧮</h1>
    <h1 class="text-2xl italic">Family Budget</h1>
    <div class="mt-30"></div>
    <ul class="flex flex-col space-y-2 gap-15 h-full justify-start">
      <li><a href="/" class={NAV_LI_STYLES}>DASHBOARD</a></li>
      <li><a href="/analytics" class={NAV_LI_STYLES}>ANALYTICS</a></li>
      <li><a href="/settings" class={NAV_LI_STYLES}>SETTINGS</a></li>
    </ul>
  </nav>

  <div
    class="w-px bg-gray-500 mt-20 ml-5 mr-20 h-[80%] justify-self-center"
  ></div>

  <div class="mt-20">
    {@render children()}
  </div>
</div>

<style lang="postcss">
  @reference "tailwindcss";

  @font-face {
    font-family: "ComicMono";
    src: url("/fonts/ComicMono.ttf");
  }

  :global(html) {
    background-color: #3a342e;
    color: #ebebeb;
    font-family: "ComicMono";
  }
</style>
