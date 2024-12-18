<script lang="ts">
  import { writable, type Writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { addCostShortcut } from "../../../data/requests";
  import {
    costCategoriesStore,
    costShortcutsStore,
    equityStore,
    userStore,
  } from "../../../data/store";
  import {
    CostShortcut,
    CostShortcutCreateRequestBody,
  } from "../../../data/types";

  let body: Writable<CostShortcutCreateRequestBody> = writable(
    new CostShortcutCreateRequestBody(
      $userStore ? $userStore.configuration : null,
    ),
  );

  // UI changes
  let errorMessage: Writable<string> = writable("");

  // if the HTTP body is ready to go - send the API call
  async function handleSuccess() {
    try {
      $body.readyToGo(); // validate user input
      const response: { result: CostShortcut } = await addCostShortcut($body);
      costShortcutsStore.set([...$costShortcutsStore, response.result]);
      goto("/shortcuts");
    } catch (e) {
      console.error("body", $body);
      $errorMessage = e.message;
    }
  }

  // clear the body and the UI respectively
  function handleReset() {
    $body = new CostShortcutCreateRequestBody(
      $userStore ? $userStore.configuration : null,
    );
    $errorMessage = "";
  }
</script>

<div class="content">
  <div class="section">
    <div class="title">
      <p>add shortcut</p>
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
      <button class="reset" onclick={handleReset}>reset</button>
      <button class="confirm" onclick={handleSuccess}>confirm</button>
    </div>
  </div>
  <p id="errorMessage">{$errorMessage}</p>
</div>

<style>
  input,
  select {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    padding: 20px 40px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .content {
    padding: 20px;
    text-align: left;
    max-width: 600px;
    margin-top: calc(10%);
  }

  .section {
    border: 2px solid #ccc;
    padding: 20px;
    border-radius: 10px;
    font-size: x-large;
  }

  .section p {
    color: #ba535f;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #errorMessage {
    color: #8e2531;
    font-weight: lighter;
    font-size: medium;
    text-align: center;
    margin-top: 20px;
  }

  .groupOfItems {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    gap: 20px;
  }

  /* Input forms */
  .categorySelector {
    flex: 8;
  }
  #value {
    flex: 8;
  }
  .currencySelector {
    flex: 2;
  }

  #costName {
    flex: 8;
  }
  .costNameSelector {
    flex: 2;
  }

  /* Buttons */
  .buttons {
    margin-top: 30px;
  }

  .reset {
    background: #d3af54;
    flex: 5;
  }
  .confirm {
    background: #32c181;
    flex: 5;
  }
</style>
