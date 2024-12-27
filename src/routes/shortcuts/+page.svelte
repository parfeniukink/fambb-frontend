<script lang="ts">
  import { onMount } from "svelte";
  import { CostShortcut, type ResponseMulti } from "../../data/types";
  import { getCostShortcuts } from "../../data/requests";
  import { costShortcutsStore } from "../../data/store";
  import CostShortcutCard from "../../components/CostShortcutCard.svelte";
  import Popup from "../../components/Popup.svelte";

  onMount(async () => {
    const response: ResponseMulti<CostShortcut> = await getCostShortcuts();
    if (!response) {
      console.error("no cost shortcuts from API");
    } else {
      $costShortcutsStore = response.result;
    }
  });
</script>

<div class="container">
  <div class="title">
    <h2>Shortcuts</h2>
    <a href="/shortcuts/create">[+]</a>
  </div>

  <div class="shortcuts">
    {#each $costShortcutsStore as shortcut}
      <CostShortcutCard {shortcut} />
    {/each}
  </div>
</div>
<Popup />

<style>
  .container {
    padding: 10px;
    margin-bottom: 50px;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  a {
    color: #32c181;
    font-weight: bold;
  }
  .shortcuts {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    row-gap: 30px;
  }
</style>
