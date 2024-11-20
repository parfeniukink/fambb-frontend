<script lang="ts">
  import  Modal  from "../../components/Modal.svelte";
  import { Input, CostCreateRequestBody } from "./types";

  // get from props
  const input = new Input();

  // API outcome data structure
  let body = new CostCreateRequestBody(input.user.configuration);

  // UI changes
  let modalRef: Modal;

  // if the HTTP body is ready to go - send the API call
  function handleSuccess() {
      if (!body.readyToGo()) {
          console.error("data is not full", body);
      } else {
          // TODO: Perform the real API call
          console.info("Cost API call creation", body);
      }
  }

  // clear the body and the UI respectively
  function handleReject() {
      body = new CostCreateRequestBody(input.user.configuration);
  }

</script>


<div class="content">

  <Modal bind:this={modalRef} />

  <div class="section">
    <p>add cost</p>

    <!-- Date Picker -->
    <div class="input-group">
      <input id="date" type="date" bind:value={body.timestamp} />
    </div>

    <!-- Select 'cost category' and 'currency' -->
    <div class="groupOfItems">
      <select
        class="categorySelector"
        value={input.user.configuration.defaultCostCategory
          ? input.user.configuration.defaultCostCategory.id
          : null}
        on:change={(e) => {
          const target = e.target as HTMLSelectElement;
          body.category_id = Number(target.value);
        }}
      >
        {#each input.costCategories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>

    <!-- Select 'cost category' and 'currency' -->
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
          target.value = "";
        }}
      >
        {#if input.user.configuration.costTemplates}
          {#each input.user.configuration.costTemplates as template}
            <option value={template}>{template}</option>
          {/each}
        {/if}
      </select>
    </div>

    <div class="groupOfItems price">
      <!-- Select 'cost name' -->
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
        value={input.user.configuration.defaultCurrency
          ? input.user.configuration.defaultCurrency.id
          : null}
        on:change={(e) => {
          let target = e.target as HTMLSelectElement;
          body.currency_id = Number(target.value);
        }}
      >
        {#each input.currencies as currency}
          <option value={currency.id}>{currency.sign}</option>
        {/each}
      </select>
    </div>

    <div class="groupOfItems buttons">
      <button class="reject" on:click={handleReject}>reject</button>
      <button
        class="confirm"
        on:click={handleSuccess}>confirm</button
      >
    </div>
  </div>
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
    color: #7ed4ad;
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

  .reject {
    background: #b03052;
    flex: 5;
  }
  .confirm {
    background: #7ed4ad;
    flex: 5;
  }
</style>
