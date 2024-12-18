<script lang="ts">
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  import { currencyExchange } from "../../data/requests";
  import { equityStore } from "../../data/store";
  import { ExchangePayloadRequestBody } from "../../data/types";

  let body = writable(new ExchangePayloadRequestBody());

  // UI changes
  let errorMessage = $state("");

  // if the HTTP body is ready to go - send the API call
  function handleSuccess() {
    try {
      $body.readyToGo();

      goto(`/analytics/transactions?currencyId=${$body!.toCurrencyId}`);
      currencyExchange($body);
      $body = new ExchangePayloadRequestBody();
      errorMessage = "";
    } catch (e) {
      console.error(e, $body);
      errorMessage = e.message;
    }
  }

  // clear the body and the UI respectively
  function handleReset() {
    $body = new ExchangePayloadRequestBody();
    errorMessage = "";
  }
</script>

<div class="content">
  <div class="section">
    <div class="title">
      <p>currency exchange</p>
      {#if errorMessage !== ""}
        <p id="errorMessage">{errorMessage}</p>
      {/if}
    </div>

    <!-- Date Picker -->
    <div class="input-group">
      <input id="date" type="date" bind:value={$body.timestamp} />
    </div>

    <!-- given money  -->
    <div class="groupOfItems price">
      <input
        id="value"
        type="number"
        inputmode="decimal"
        pattern="\d*"
        bind:value={$body.fromValue}
        placeholder="you give..."
      />
      <select class="currencySelector" bind:value={$body.fromCurrencyId}>
        {#if $equityStore}
          {#each $equityStore as equity}
            <option value={equity.currency.id}>{equity.currency.sign}</option>
          {/each}
        {/if}
      </select>
    </div>

    <!-- received money  -->
    <div class="groupOfItems price">
      <input
        id="value"
        type="number"
        inputmode="decimal"
        pattern="\d*"
        bind:value={$body.toValue}
        placeholder="you received..."
      />
      <select class="currencySelector" bind:value={$body.toCurrencyId}>
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
