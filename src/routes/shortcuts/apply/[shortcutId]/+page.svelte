<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  import Section from "../../../../components/Section.svelte";
  import { applyCostShortcut } from "../../../../data/requests";
  import { onMount } from "svelte";

  let value = writable(null);
  let errorMessage = $state("");

  onMount(() => {
    if (!$page.params.shortcutId) {
      goto("/shortcuts");
    }
  });

  async function handleSubmit() {
    if (!$value) {
      errorMessage = "no value";
    } else if ($value <= 0) {
      errorMessage = "value must be > 0";
    } else {
      console.log("body", { value: $value });
      applyCostShortcut($page.params.shortcutId, { value: $value });
      goto("/shortcuts");
    }
  }
</script>

<div class="container">
  <Section title="apply shortcut">
    <div id="applyshortcutsendform">
      <input
        id="value"
        type="number"
        inputmode="decimal"
        pattern="\d*"
        bind:value={$value}
        placeholder="value..."
      />
      <br />
      <button id="applyShortcutSendValueButton" onclick={handleSubmit}
        >save</button
      >
    </div>
  </Section>
  {#if errorMessage}
    <p class="red-text">${errorMessage}</p>
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
