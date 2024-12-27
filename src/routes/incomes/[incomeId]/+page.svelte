<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";
  import { IncomePayloadRequestBody, type Income } from "../../../data/types";
  import { userStore, equityStore } from "../../../data/store";
  import {
    getIncome,
    updateIncome,
    deleteIncome,
  } from "../../../data/requests";
  import { writable, type Writable } from "svelte/store";

  const incomeSources: string[] = ["revenue", "gift", "debt", "other"];
  let body: Writable<IncomePayloadRequestBody> = writable(
    new IncomePayloadRequestBody(),
  );
  let errorMessage: Writable<string> = writable("");
  let instance: Income | null = $state(null);

  onMount(async () => {
    instance = await fetchExistingInstance(Number($page.params.incomeId));

    // update the body with default data
    $body.name = instance.name;
    $body.value = instance.value;
    $body.source = instance.source;
    $body.timestamp = instance.timestamp;
    $body.currencyId = instance.currency.id;
  });

  async function fetchExistingInstance(instanceId: number): Promise<Income> {
    const response = await getIncome(instanceId);
    const instance: Income = response.result;
    return instance;
  }

  async function handleUpdate() {
    goto(`/analytics/transactions?currencyId=${instance!.currency.id}`);

    try {
      if ($body.readyToGo()) {
        updateIncome(instance!.id, $body);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleReset() {
    if (!instance) {
      $errorMessage = "server error";
    } else {
      $body.name = instance.name;
      $body.value = instance.value;
      $body.source = instance.source;
      $body.timestamp = instance.timestamp;
      $body.currencyId = instance.currency.id;
    }
  }

  async function handleDelete() {
    goto(`/analytics/transactions?currencyId=${instance!.currency.id}`);
    try {
      deleteIncome(instance!.id);
    } catch (e) {
      console.error("Error", e);
    }
  }
</script>

<div class="content">
  <div class="section">
    <div class="title">
      <div class="header">
        income@{instance ? instance.user.toLowerCase() : ""}
      </div>
      <button class="deleteButton" onclick={handleDelete}>delete</button>
    </div>

    <!-- date picker -->
    <div class="input-group">
      <input id="date" type="date" bind:value={$body.timestamp} />
    </div>

    <!-- select 'income source' -->
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
        type="text"
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
    color: #32c181;
    font-size: large;
  }

  .deleteButton {
    background-color: transparent;
    font-style: italic;
    color: #ba535f;
  }
</style>
