<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";
  import { CostPayloadRequestBody, type Cost } from "../../../data/types";
  import {
    costCategoriesStore,
    userStore,
    equityStore,
  } from "../../../data/store";
  import { getCost, updateCost, deleteCost } from "../../../data/requests";
  import { writable } from "svelte/store";

  let body = writable(new CostPayloadRequestBody());
  let errorMessage = writable("");
  let instance: Cost | null = $state(null);

  onMount(async () => {
    instance = await fetchExistingInstance(Number($page.params.costId));

    // update the body with default data
    $body.timestamp = instance.timestamp;
    $body.name = instance.name;
    $body.value = instance.value;
    $body.currencyId = instance.currency.id;
    $body.categoryId = instance.category.id;
  });

  async function fetchExistingInstance(instanceId: number): Promise<Cost> {
    const response = await getCost(instanceId);
    const instance: Cost = response.result;
    return instance;
  }

  async function handleUpdate() {
    try {
      if ($body.readyToGo()) {
        await updateCost(instance!.id, $body);
        goto(`/analytics/transactions?currencyId=${instance!.currency.id}`);
      } else {
        $errorMessage = "some fields are invalid";
      }
    } catch (e) {
      console.error(e);
      errorMessage = e.message;
    }
  }

  async function handleReset() {
    if (!instance) {
      $errorMessage = "server error";
    } else {
      $body.timestamp = instance.timestamp;
      $body.name = instance.name;
      $body.value = instance.value;
      $body.currencyId = instance.currency.id;
      $body.categoryId = instance.category.id;
    }
  }

  async function handleDelete() {
    goto(`/analytics/transactions?currencyId=${instance!.currency.id}`);
    try {
      deleteCost(instance!.id);
    } catch (e) {
      console.error("Error", e);
    }
  }
</script>

<div class="content">
  <div class="section">
    <div class="title">
      <div class="header">
        cost@{instance ? instance.user.toLowerCase() : ""}
      </div>
      <button class="deleteButton" onclick={handleDelete}>delete</button>
    </div>

    <!-- date picker -->
    <div class="input-group">
      <input id="date" type="date" bind:value={$body.timestamp} />
    </div>

    <!-- select 'cost category' -->
    <div class="groupOfItems">
      <select class="categorySelector" bind:value={$body.categoryId}>
        h {#each $costCategoriesStore as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>

    <!-- Select 'cost name' -->
    <div class="groupOfItems">
      <input id="costName" type="text" bind:value={$body.name} />
      <select
        class="costNameSelector"
        value=""
        onchange={(e) => {
          const target = e.target as HTMLSelectElement;
          $body.name = target.value;
          target.value = "";
        }}
      >
        {#if $userStore!.configuration.costSnippets}
          <option selected value=""></option>
          {#each $userStore!.configuration.costSnippets as template}
            <option value={template}>{template}</option>
          {/each}
        {/if}
      </select>
    </div>

    <div class="groupOfItems price">
      <!-- Set 'cost value' -->
      <input
        id="value"
        type="text"
        inputmode="decimal"
        pattern="\d*"
        bind:value={$body.value}
      />
      <select class="currencySelector" bind:value={$body.currencyId}>
        {#each $equityStore as equity}
          <option value={equity.currency.id}>{equity.currency.sign}</option>
        {/each}
      </select>
    </div>

    <div class="groupOfItems buttons">
      <button class="reset" onclick={handleReset}>reset</button>
      <button class="confirm" onclick={handleUpdate}>update</button>
    </div>
  </div>

  <p id="errorMessage">{$errorMessage}</p>
</div>

<style>
  @import "../page.css";
  .title {
    display: flex;
    height: 100%;
    justify-content: center;
  }
  .header {
    font-size: large;
    color: #ba535f;
  }

  .deleteButton {
    background-color: transparent;
    font-style: italic;
    color: #ba535f;
  }
</style>
