<script lang="ts">
  let { children } = $props()
  import "../app.css"
  import logo from "$lib/assets/logo.png"

  const NAV_LI_STYLES = "hover:text-teal-600 cursor-pointer"
</script>

<div class="flex h-screen">
  <nav class="w-48 text-xl mt-50 ml-10 text-center h-100">
    <ul class="flex flex-col space-y-2 gap-15 h-full justify-start">
      <li><a href="/analytics" class={NAV_LI_STYLES}>ANALYTICS</a></li>
      <li>
        <a href="/" class={NAV_LI_STYLES}
          ><img src={logo} alt="Logo" class="w-32 h-32 inline-block" /></a
        >
      </li>
      <li><a href="/settings" class={NAV_LI_STYLES}>SETTINGS</a></li>
    </ul>
  </nav>

  <div class="w-px bg-gray-200 mt-10 mr-10 h-[70%]"></div>

  <main class="mt-10 w-full">
    {@render children()}
  </main>
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
