<script lang="ts">
  import { onMount } from "svelte";
  import Section from "../../components/Section.svelte";
  import {
    userStore,
    costCategoriesStore,
    equityStore,
    popupStore,
  } from "../../data/store";
  import { updateUserConfiguration } from "../../data/requests";

  // probably ``derived()`` should be used here
  let defaultCostCategoryId: number | null = $state(null);
  let defaultCurrencyId: number | null = $state(null);

  onMount(async () => {
    if ($userStore && $userStore.configuration) {
      if ($userStore.configuration.defaultCostCategory) {
        defaultCostCategoryId = $userStore.configuration.defaultCostCategory.id;
      }

      if ($userStore.configuration.defaultCurrency) {
        defaultCurrencyId = $userStore.configuration.defaultCurrency.id;
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
        <br />
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
      </Section>
    {/if}
  </div>
</div>

<style>
  .settings-container {
    margin-top: calc(50%);
  }
  .config {
    display: flex;
    flex-direction: column;
    text-align: left;
    width: 100%;
  }
</style>
