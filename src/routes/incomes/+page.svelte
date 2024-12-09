<script lang="ts">
  import { IncomePayloadRequestBody } from "../../data/types";
  import { userStore, equityStore } from "../../data/store";
  import { writable } from "svelte/store";
  import { addIncome } from "../../data/requests";

  const incomeSources: string[] = ["revenue", "gift", "debt", "other"];

  // API outcome data structure
  let body = writable(new IncomePayloadRequestBody($userStore!.configuration));

  // UI changes
  let errorMessage = "";

  // if the HTTP body is ready to go - send the API call
  function handleSuccess() {
    if ($body.readyToGo()) {
      // add task to the event loop
      addIncome($body);

      // empty the page without redirection
      $body = new IncomePayloadRequestBody($userStore!.configuration);
      errorMessage = "";
    } else {
      console.error("data is not full", $body);
      errorMessage = "complete input";
    }
  }

  // clear the body and the UI respectively
  function handleReset() {
    $body = new IncomePayloadRequestBody($userStore!.configuration);
    errorMessage = "";
  }
</script>

<div class="content">
  <div class="section">
    <div class="title">
      <p>add income</p>
      {#if errorMessage !== ""}
        <p id="errorMessage">{errorMessage}</p>
      {/if}
    </div>

    <!-- Date Picker -->
    <div class="input-group">
      <input id="date" type="date" bind:value={$body.timestamp} />
    </div>

    <!-- Select 'income source' -->
    <select bind:value={$body.source}>
      {#each incomeSources as source}
        <option value={source}>{source}</option>
      {/each}
    </select>

    <!-- Select 'income name' -->
    <div class="groupOfItems">
      <input
        id="incomeName"
        type="text"
        placeholder="name..."
        bind:value={$body.name}
      />
      <select
        class="incomeNameSelector"
        value=""
        onchange={(e) => {
          const target = e.target as HTMLSelectElement;
          $body.name = target.value;
          target.value = "not existing";
        }}
      >
        <option value="" selected></option>
        {#if $userStore!.configuration.incomeSnippets}
          {#each $userStore!.configuration.incomeSnippets as template}
            <option value={template}>{template}</option>
          {/each}
        {/if}
      </select>
    </div>

    <!-- Set 'money' -->
    <div class="groupOfItems">
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
</div>

<style>
  @import "./page.css";
</style>
