<script lang="ts">
  import "../app.css"
  import logo from "$lib/assets/logo.png"
  import { Toaster } from "svelte-french-toast"
  import { persistent } from "$lib/data/persistent.svelte"
  import Button from "$lib/components/Button.svelte"
  import Input from "$lib/components/Input.svelte"

  let { children } = $props()

  let token: string = $state("")

  // styles
  const NAV_LI_STYLES = "hover:text-teal-600 cursor-pointer"
</script>

<div class="flex h-screen">
  {#if persistent.authenticated}
    <nav class="w-48 text-xl mt-10 ml-10 text-center h-100">
      <ul class="flex flex-col space-y-2 gap-15 h-full justify-start">
        <li>
          <a href="/" class={NAV_LI_STYLES}
            ><img src={logo} alt="Logo" class="w-32 h-32 inline-block" /></a
          >
        </li>
        <li><a href="/analytics" class={NAV_LI_STYLES}>ANALYTICS</a></li>
        <li><a href="/settings" class={NAV_LI_STYLES}>SETTINGS</a></li>
      </ul>
    </nav>
  {/if}

  <div class="w-px bg-gray-200 mt-10 mr-20 h-[70%]"></div>

  {#if persistent.authenticated}
    <main class="mt-10 w-full">
      {@render children()}
    </main>
  {:else}
    <main
      class="w-full flex flex-col justify-center content-center items-center gap-10 px-100"
    >
      <h1 class="text-xl">AUTHENTICATION</h1>
      <Input bind:value={token} placeholder={"token..."} />
      <Button
        title="SUBMIT"
        color="blue"
        onclick={async () => {
          await persistent.loadIdentity(token)
          await persistent.initialize()
        }}
      />
    </main>
  {/if}
  <Toaster />
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
    letter-spacing: 0.1em;
  }
</style>
