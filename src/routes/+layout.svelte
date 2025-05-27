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

<main class="flex h-screen w-full m-0 p-0">
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
    <div class="w-px bg-gray-200 mt-10 mr-20 h-[70%]"></div>
  {/if}

  {#if persistent.authenticated}
    <div class="mt-10 mr-10 w-full">
      {@render children()}
    </div>
  {:else}
    <div class="flex w-full justify-center">
      <div class="flex flex-col w-96 self-center gap-3 text-center">
        <h1 class="text-xl mb-3 font-bold">AUTHENTICATION</h1>
        <Input bind:value={token} placeholder={"token..."} />
        <Button
          title="SUBMIT"
          color="blue"
          onclick={async () => {
            await persistent.loadIdentity(token)
            await persistent.initialize()
          }}
        />
      </div>
    </div>
  {/if}
  <Toaster />
</main>

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
