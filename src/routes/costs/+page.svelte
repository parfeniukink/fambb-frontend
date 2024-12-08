<script lang="ts">
  import { writable } from "svelte/store";
  import { addCost } from "../../data/requests";
  import {
    costCategoriesStore,
    equityStore,
    userStore,
  } from "../../data/store";
  import { CostPayloadRequestBody } from "../../data/types";

  let body = writable(
    new CostPayloadRequestBody($userStore ? $userStore.configuration : null),
  );

  // UI changes
  let errorMessage = $state("");

  // if the HTTP body is ready to go - send the API call
  function handleSuccess() {
    if ($body.readyToGo()) {
      // add task to the event loop
      addCost($body);

      // empty the page without redirection
      $body = new CostPayloadRequestBody($userStore!.configuration);
      errorMessage = "";
    } else {
      console.error("data is not full", $body);
      errorMessage = "complete input";
    }
  }

  // clear the body and the UI respectively
  function handleReject() {
    $body = new CostPayloadRequestBody($userStore!.configuration);
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
      <input id="date" type="date" bind:value={$body.timestamp} />
    </div>

    <!-- Select 'cost category' -->
    <div class="groupOfItems">
      <select class="categorySelector" bind:value={$body.categoryId}>
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
        bind:value={$body.name}
      />
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
        type="number"
        inputmode="decimal"
        pattern="\d*"
        bind:value={$body.value}
        placeholder="value..."
      />
      <select class="currencySelector" bind:value={$body.currencyId}>
        {#each $equityStore as equity}
          <option value={equity.currency.id}>{equity.currency.sign}</option>
        {/each}
      </select>
    </div>

    <div class="groupOfItems buttons">
      <button class="reset" onclick={handleReject}>reset</button>
      <button class="confirm" onclick={handleSuccess}>confirm</button>
    </div>
  </div>
</div>

<style>
  @import "./page.css";
</style>
