<script lang="ts">
  import { goto } from "$app/navigation";

  import { addCost } from "../../data/requests";
  import {
    costCategoriesStore,
    equityStore,
    userStore,
  } from "../../data/store";
  import { CostCreateRequestBody } from "./services";

  let body = new CostCreateRequestBody(
    $userStore ? $userStore.configuration : null,
  );

  // UI changes
  let errorMessage = "";

  // if the HTTP body is ready to go - send the API call
  async function handleSuccess() {
    if (!body.readyToGo()) {
      console.error("data is not full", body);
      errorMessage = "complete input";
    } else {
      console.log(body);
      errorMessage = "";
      await Promise.all([addCost(body), goto("/")]);
    }
  }

  // clear the body and the UI respectively
  function handleReject() {
    body = new CostCreateRequestBody($userStore.configuration);
    errorMessage = "";
  }
</script>

<div class="content">
  <div class="section">
    <div class="title">
      <p>add cost</p>
      {#if errorMessage !== ""}
        <p id="errorMessage">{errorMessage}</p>
      {/if}
    </div>

    <!-- Date Picker -->
    <div class="input-group">
      <input id="date" type="date" bind:value={body.timestamp} />
    </div>

    <!-- Select 'cost category' -->
    <div class="groupOfItems">
      <select
        class="categorySelector"
        value={$userStore.configuration.defaultCostCategory
          ? $userStore.configuration.defaultCostCategory.id
          : null}
        on:change={(e) => {
          const target = e.target as HTMLSelectElement;
          body.categoryId = Number(target.value);
        }}
      >
        {#each $costCategoriesStore as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>

    <!-- Select 'cost name' -->
    <div class="groupOfItems">
      <input
        id="costName"
        type="text"
        placeholder="name..."
        bind:value={body.name}
      />
      <select
        class="costNameSelector"
        value=""
        on:change={(e) => {
          const target = e.target as HTMLSelectElement;
          body.name = target.value;
          target.value = "not existing";
        }}
      >
        {#if $userStore.configuration.costSnippets}
          {#each $userStore.configuration.costSnippets as template}
            <option value={template}>{template}</option>
          {/each}
        {/if}
      </select>
    </div>

    <div class="groupOfItems price">
      <!-- Set 'cost value' -->
      <input
        id="value"
        type="number"
        inputmode="decimal"
        pattern="\d*"
        bind:value={body.value}
        placeholder="value..."
      />
      <select
        class="currencySelector"
        value={$userStore.configuration.defaultCurrency
          ? $userStore.configuration.defaultCurrency.id
          : null}
        on:change={(e) => {
          let target = e.target as HTMLSelectElement;
          body.currencyId = Number(target.value);
        }}
      >
        {#each $equityStore as equity}
          <option value={equity.currency.id}>{equity.currency.sign}</option>
        {/each}
      </select>
    </div>

    <div class="groupOfItems buttons">
      <button class="reject" on:click={handleReject}>reject</button>
      <button class="confirm" on:click={handleSuccess}>confirm</button>
    </div>
  </div>
</div>

<style>
  @import "./page.css";
</style>
