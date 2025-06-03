<script lang="ts">
  import "../app.css"
  import logoDashboard from "$lib/assets/dashboard.png"
  import logoAnalytics from "$lib/assets/analytics.png"
  import logoShortcuts from "$lib/assets/shortcuts.png"
  import logoSettings from "$lib/assets/settings.png"
  import { Toaster } from "svelte-french-toast"
  import { persistent } from "$lib/data/persistent.svelte"
  import Button from "$lib/components/Button.svelte"
  import Input from "$lib/components/Input.svelte"

  let { children } = $props()

  // define global state for device type
  let isMobile = persistent.mobileDevice

  // onMount(() => {
  //   // note: for each window resize
  //   //  ─────────────────────────────────────────────────────────
  //   window.addEventListener("resize", mutateIsMobile)
  //   return () => window.removeEventListener("resize", mutateIsMobile)
  //   //  ─────────────────────────────────────────────────────────
  // })

  let token: string = $state("")

  const STYLES: Record<string, string> = {
    mobileNavLi: "w-14",
  }
</script>

<!-- ───────────────────────────────────────────────────────── -->
<!-- MOBILE LAYOUT -->
<!-- ───────────────────────────────────────────────────────── -->
{#if isMobile}
  <main class="w-full m-0 p-0">
    {#if persistent.authenticated}
      <nav class="w-full bg-[#3a342e] fixed bottom-0 border-t-5 pt-1 z-40">
        <ul class="flex justify-around">
          <li>
            <a href="/"
              ><img
                src={logoDashboard}
                alt="Dashboard"
                class={STYLES.mobileNavLi}
              /></a
            >
          </li>
          <li>
            <a href="/analytics"
              ><img
                src={logoAnalytics}
                alt="Analytics"
                class={STYLES.mobileNavLi}
              /></a
            >
          </li>
          <li>
            <a href="/transactions/costs/shortcuts"
              ><img
                src={logoShortcuts}
                alt="Shortcuts"
                class={STYLES.mobileNavLi}
              /></a
            >
          </li>
          <li>
            <a href="/settings"
              ><img
                src={logoSettings}
                alt="Settings"
                class={STYLES.mobileNavLi}
              /></a
            >
          </li>
        </ul>
      </nav>
    {/if}

    {#if persistent.authenticated}
      <div class="pt-10 px-3 w-full">
        {@render children()}
      </div>
    {:else}
      <div
        class="flex flex-col px-5 w-full h-screen justify-center self-center gap-3 text-center"
      >
        <h1 class="text-xl mb-3 font-bold">AUTHENTICATION</h1>
        <Input bind:value={token} placeholder={"token..."} type="password" />
        <Button
          title="SUBMIT"
          color="blue"
          onclick={async () => {
            await persistent.loadIdentity(token)
            await persistent.initialize()
          }}
        />
      </div>
    {/if}
    <Toaster />
  </main>
{/if}

<!-- ───────────────────────────────────────────────────────── -->
<!-- DESKTOP LAYOUT -->
<!-- ───────────────────────────────────────────────────────── -->
{#if !isMobile}
  <main class="flex h-screen w-full m-0 p-0">
    {#if persistent.authenticated}
      <nav class="min-w-32 text-xl mt-10 ml-5 text-center h-100">
        <ul class="flex flex-col space-y-2 gap-15 h-full justify-start">
          <li>
            <a href="/"
              ><img
                src={logoDashboard}
                alt="Logo"
                class="w-20 inline-block"
              /></a
            >
          </li>
          <li>
            <a href="/analytics"
              ><img
                src={logoAnalytics}
                alt="Logo"
                class="w-20 inline-block"
              /></a
            >
          </li>
          <li>
            <a href="/settings"
              ><img
                src={logoSettings}
                alt="Logo"
                class="w-20 inline-block"
              /></a
            >
          </li>
        </ul>
      </nav>

      <!-- DIVIDER -->
      <div class="min-w-0.5 bg-gray-400 mt-10 mr-10 h-[70%]"></div>
    {/if}

    {#if persistent.authenticated}
      <div class="pt-10 pr-3 w-full">
        {@render children()}
      </div>
    {:else}
      <div class="flex w-full justify-center">
        <div class="flex flex-col w-96 self-center gap-3 text-center">
          <h1 class="text-xl mb-3 font-bold">AUTHENTICATION</h1>
          <Input bind:value={token} placeholder={"token..."} type="password" />
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
{/if}

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
