<script lang="ts">
  import { goto } from "$app/navigation";
  import { popupStore } from "../data/store";
  import { applyCostShortcut, deleteCostShortcut } from "../data/requests";
  import { costShortcutsStore } from "../data/store";
  import type { CostShortcut } from "../data/types";

  const { shortcut }: { shortcut: CostShortcut } = $props();

  async function handleCardTap() {
    try {
      if (shortcut.value != null) {
        applyCostShortcut(shortcut.id);
        popupStore.showPopup("saved");
      } else {
        goto(`/shortcuts/apply/${shortcut.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteTap() {
    try {
      costShortcutsStore.set(
        $costShortcutsStore.filter((item) => item.id != shortcut.id),
      );
      deleteCostShortcut(shortcut.id);
      popupStore.showPopup("deleted");
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="cost-shortcut-group-container">
  <button
    id="delete-button"
    onclick={handleDeleteTap}
    aria-label="delete-button"
  ></button>

  <button id="card" onclick={handleCardTap}>
    <p id="shortcut-name">{shortcut.name}</p>
    <p class="category-name">{shortcut.category.name}</p>
    {#if shortcut.value}
      <p class="money">{shortcut.value} {shortcut.currency.sign}</p>
    {:else}
      <p>... {shortcut.currency.sign}</p>
    {/if}
  </button>
</div>

<style>
  p {
    margin: 0 0;
  }

  #delete-button {
    position: absolute;
    background-color: #e55e69;
    opacity: 90%;
    border: 0px solid grey;
    width: 20px;
    height: 30px;
    border-radius: 50%;
  }

  .category-name {
    color: gray;
    font-style: italic;
    font-size: small;
  }

  #card {
    margin: 10px;
    padding: 10px;
    width: 130px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    border: 3px solid grey;
    border-radius: 4px;
  }
  #card:hover {
    border: 3px solid #caf492;
    transition: ease-in-out;
    animation-duration: 0.3s;
  }

  .money {
    color: #caf492;
  }
</style>
