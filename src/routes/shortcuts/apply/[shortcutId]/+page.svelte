<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { writable, type Writable } from "svelte/store";
  import Section from "../../../../components/Section.svelte";
  import { applyCostShortcut } from "../../../../data/requests";
  import { validateMoney } from "../../../../services";
  import { onMount } from "svelte";

  let rawValue: Writable<string | null> = writable(null);
  let errorMessage: Writable<string> = writable("");

  onMount(() => {
    if (!$page.params.shortcutId) {
      goto("/shortcuts");
    }
  });

  async function handleSubmit() {
    if (!$rawValue) {
      $errorMessage = "no value";
      return;
    }

    const value: number = validateMoney($rawValue);

    if (value <= 0) {
      $errorMessage = "value must be > 0";
    } else {
      console.log("body", { value: value });
      applyCostShortcut($page.params.shortcutId, { value: value });
      goto("/shortcuts");
    }
  }
</script>

<div class="container">
  <Section title="apply shortcut">
    <div id="applyshortcutsendform">
      <input
        id="value"
        type="text"
        inputmode="decimal"
        placeholder="value..."
        bind:value={$rawValue}
      />
      <br />
      <button id="applyShortcutSendValueButton" onclick={handleSubmit}
        >save</button
      >
    </div>
  </Section>
  {#if $errorMessage}
    <p class="red-text">{$errorMessage}</p>
  {/if}
</div>

<style>
  .container {
    margin-top: calc(80%);
  }
  #applyshortcutsendform {
    display: flex;
    flex-direction: column;
  }
  #applyShortcutSendValueButton {
    background-color: transparent;
    border: 4px solid silver;
  }
  .red-text {
    color: #d68f97;
  }
</style>
