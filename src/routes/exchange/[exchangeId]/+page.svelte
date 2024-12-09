<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import { onMount } from "svelte";
  import type { Exchange } from "../../../data/types";
  import { getExchange, deleteExchange } from "../../../data/requests";

  let errorMessage = $state("");
  let fromMoney: string = $state("");
  let toMoney: string = $state("");
  let instance: Exchange | null = $state(null);

  onMount(async () => {
    instance = await fetchExistingInstance(Number($page.params.exchangeId));
    fromMoney = `${instance.fromValue} ${instance.fromCurrency.sign}`;
    toMoney = `${instance.toValue} ${instance.toCurrency.sign}`;
  });

  async function fetchExistingInstance(instanceId: number): Promise<Exchange> {
    const response = await getExchange(instanceId);
    return response.result as Exchange;
  }

  async function handleDelete() {
    goto(`/analytics/transactions?currencyId=${instance!.toCurrency.id}`);

    try {
      deleteExchange(instance!.id);
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="content">
  <div class="section">
    <div class="title">
      <p>exchange @{instance ? instance.user.toLowerCase() : ""}</p>
      {#if errorMessage !== ""}
        <p id="errorMessage">{errorMessage}</p>
      {/if}
    </div>

    <p class="timestamp">{instance ? instance.timestamp : "loading..."}</p>
    <p class="conversion">{fromMoney} --> {toMoney}</p>

    <button class="delete" onclick={handleDelete}>delete</button>
  </div>
</div>

<style>
  button {
    padding: 20px 40px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ba535f;
    width: 100%;
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
    align-items: right;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title p {
    color: #2c7bb7;
  }

  .conversion {
    text-align: center;
    margin: 40px auto;
    color: white;
  }
  .timestamp {
    text-align: center;
    color: white;
  }
</style>
