<script lang="ts">
  import { IncomeCreateRequestBody } from "./services";
  import { userStore, equityStore } from "../../data/store";
  const incomeSources: string[] = ["revenue", "gift", "debt", "other"];

  // API outcome data structure
  let body = new IncomeCreateRequestBody($userStore.configuration);

  // UI changes
  let errorMessage = "";

  // if the HTTP body is ready to go - send the API call
  function handleSuccess() {
    if (!body.readyToGo()) {
      console.error("data is not full", body);
      errorMessage = "complete input";
    } else {
      // TODO: Perform the real API call
      body = new IncomeCreateRequestBody($userStore.configuration);
      errorMessage = "";
    }
  }

  // clear the body and the UI respectively
  function handleReject() {
    body = new IncomeCreateRequestBody($userStore.configuration);
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
      <input id="date" type="date" bind:value={body.timestamp} />
    </div>

    <!-- Select 'income source' -->
    <select
      bind:value={body.source}
      on:change={(e) => {
        const target = e.target as HTMLSelectElement;
        body.source = target.value;
      }}
    >
      {#each incomeSources as source}
        <option value="source">{source}</option>
      {/each}
    </select>

    <!-- Select 'income name' -->
    <div class="groupOfItems">
      <input
        id="incomeName"
        type="text"
        placeholder="name..."
        bind:value={body.name}
      />
      <select
        class="incomeNameSelector"
        value=""
        on:change={(e) => {
          const target = e.target as HTMLSelectElement;
          body.name = target.value;
          target.value = "not existing";
        }}
      >
        {#if $userStore.configuration.incomeSnippets}
          {#each $userStore.configuration.incomeSnippets as template}
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
        bind:value={body.value}
        placeholder="value..."
      />
      <select
        class="currencySelector"
        bind:value={body.currencyId}
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
