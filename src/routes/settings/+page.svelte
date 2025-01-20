<script lang="ts">
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import Section from "../../components/Section.svelte";
  import {
    userStore,
    costCategoriesStore,
    equityStore,
    popupStore,
  } from "../../data/store";
  import { updateUserConfiguration } from "../../data/requests";
  import Popup from "../../components/Popup.svelte";
  import * as localStorageRepository from "../../data/localStorageRepository";

  // data state
  // probably ``derived()`` should be used here
  let defaultCostCategoryId: number | null = $state(null);
  let defaultCurrencyId: number | null = $state(null);

  // UI state
  let costSnippetsRepr: Writable<string> = writable("");
  let incomeSnippetsRepr: Writable<string> = writable("");

  onMount(async () => {
    if ($userStore && $userStore.configuration) {
      if ($userStore.configuration.defaultCostCategory) {
        defaultCostCategoryId = $userStore.configuration.defaultCostCategory.id;
      }

      if ($userStore.configuration.defaultCurrency) {
        defaultCurrencyId = $userStore.configuration.defaultCurrency.id;
      }

      if ($userStore.configuration.costSnippets) {
        $costSnippetsRepr = $userStore.configuration.costSnippets.join(", ");
      }
      if ($userStore.configuration.incomeSnippets) {
        $incomeSnippetsRepr =
          $userStore.configuration.incomeSnippets.join(", ");
      }
    }
  });

  async function updateDefaultCostCategory() {
    updateUserConfiguration({ defaultCostCategoryId: defaultCostCategoryId });
    const item = $costCategoriesStore.find((item) => {
      item.id === defaultCostCategoryId;
    });

    if (item) {
      $userStore!.configuration.defaultCostCategory = item;
    } else {
      popupStore.showPopup("something went wrong");
    }
  }

  async function updateDefaultCurrency() {
    updateUserConfiguration({ defaultCurrencyId: defaultCurrencyId });
    const item = $equityStore.find((item) => {
      item.currency.id === defaultCurrencyId;
    });
    if (item) {
      $userStore!.configuration.defaultCurrency = item.currency;
    } else {
      popupStore.showPopup("something went wrong");
    }
  }

  // update cost snippets
  async function updateCostSnippets() {
    let snippets: string[] = [];

    // ERROR FLOW
    if (!$costSnippetsRepr) {
      snippets = [];
      $userStore!.configuration.costSnippets = snippets;
      popupStore.showPopup("snippets removed");
    } else {
      try {
        snippets = $costSnippetsRepr
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } catch (e) {
        popupStore.showPopup("cant split costs");
        $costSnippetsRepr = $userStore!.configuration.costSnippets!.join(",");
        return;
      }
    }

    // SUCCESS FLOW
    try {
      updateUserConfiguration({ costSnippets: snippets });
      $userStore!.configuration.costSnippets = snippets;
      $costSnippetsRepr = snippets.join(", ");
      localStorageRepository.setUser($userStore!);
      popupStore.showPopup("updated");
    } catch (e) {
      popupStore.showPopup("can't update cost snippets");
    }
  }

  async function resetIncomeSnippets() {
    $incomeSnippetsRepr = $userStore!.configuration.incomeSnippets
      ? $userStore!.configuration.incomeSnippets.join(", ")
      : "";
  }

  // update income snippets
  async function updateIncomeSnippets() {
    let snippets: string[] = [];

    // FAILED FLOW
    if ($incomeSnippetsRepr) {
      try {
        snippets = $incomeSnippetsRepr
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } catch (e) {
        popupStore.showPopup("cant split incomes");

        $incomeSnippetsRepr =
          $userStore!.configuration.incomeSnippets!.join(",");

        return;
      }
    }

    // SUCCESS FLOW
    try {
      updateUserConfiguration({ incomeSnippets: snippets });
      $userStore!.configuration.incomeSnippets = snippets;
      $incomeSnippetsRepr = snippets.join(", ");
      localStorageRepository.setUser($userStore!);
      popupStore.showPopup("updated");
    } catch (e) {
      popupStore.showPopup("can't update income snippets");
    }
  }

  async function resetCostSnippets() {
    $incomeSnippetsRepr = $userStore!.configuration.incomeSnippets
      ? $userStore!.configuration.incomeSnippets.join(", ")
      : "";
  }
</script>

<div class="container">
  <div class="settings-container">
    {#if !$userStore}
      <p>loading...</p>
    {:else}
      <Section title="settings">
        <div class="config">
          <p>default cost category</p>
          <select
            class="categorySelector"
            bind:value={$userStore!.configuration.defaultCostCategory!.id}
            onchange={updateDefaultCostCategory}
          >
            {#each $costCategoriesStore as category}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>
        </div>
        <hr />
        <div class="config">
          <p>default currency</p>
          <select
            class="currencySelector"
            bind:value={$userStore!.configuration.defaultCurrency!.id}
            onchange={updateDefaultCurrency}
          >
            {#each $equityStore as equity}
              <option value={equity.currency.id}>{equity.currency.sign}</option>
            {/each}
          </select>
        </div>
        <hr />
        <div class="config">
          <p>cost snippets</p>
          <div class="snippets-raw-data">
            <input id="cost-snippets-input" bind:value={$costSnippetsRepr} />
          </div>
          <div class="snippet-buttons">
            <button class="snippets-update-button" onclick={updateCostSnippets}
              >update</button
            >
            <button class="snippets-reset-button" onclick={resetCostSnippets}
              >reset</button
            >
          </div>
        </div>
        <hr />
        <div class="config">
          <p>income snippets</p>
          <div class="snippets-raw-data">
            <input id="cost-snippets-input" bind:value={$incomeSnippetsRepr} />
          </div>
          <div class="snippet-buttons">
            <button
              class="snippets-update-button"
              onclick={updateIncomeSnippets}>update</button
            >
            <button class="snippets-reset-button" onclick={resetIncomeSnippets}
              >reset</button
            >
          </div>
        </div>
      </Section>
    {/if}
  </div>
</div>
<Popup />

<style>
  .settings-container {
    margin-top: calc(1%);
  }
  .config {
    display: flex;
    flex-direction: column;
    text-align: left;
    width: 100%;
  }

  .snippet-buttons {
    display: flex;
    flex-flow: raw wrap;
    justify-content: space-around;
    align-items: start;
  }

  p {
    margin-top: 10px;
  }

  button {
    padding: 5px 25px;
    background: transparent;
    text-align: center;
    border: 1px solid white;
  }
</style>
