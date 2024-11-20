<script lang="ts">
  import { Input, CostCreateRequestBody } from "./types";

  // Initiate mocked props
  const mocked = new Input();

  // API outcome data structure
  let body = new CostCreateRequestBody(mocked.user.configuration);

  // UI changes
  let errorMessage = "";

  // if the HTTP body is ready to go - send the API call
  function handleSuccess() {
      if (!body.readyToGo()) {
          console.error("data is not full", body);
          errorMessage = "complete input";
      } else {
          // TODO: Perform the real API call
          console.info("Cost API call creation", body);
          body = new CostCreateRequestBody(mocked.user.configuration);
          errorMessage = "";
      }
  }

  // clear the body and the UI respectively
  function handleReject() {
      body = new CostCreateRequestBody(mocked.user.configuration);
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

    <!-- Select 'cost category' and 'currency' -->
    <div class="groupOfItems">
      <select
        class="categorySelector"
        value={mocked.user.configuration.defaultCostCategory
          ? mocked.user.configuration.defaultCostCategory.id
          : null}
        on:change={(e) => {
          const target = e.target as HTMLSelectElement;
          body.category_id = Number(target.value);
        }}
      >
        {#each mocked.costCategories as category}
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
        {#if mocked.user.configuration.costTemplates}
          {#each mocked.user.configuration.costTemplates as template}
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
        value={mocked.user.configuration.defaultCurrency
          ? mocked.user.configuration.defaultCurrency.id
          : null}
        on:change={(e) => {
          let target = e.target as HTMLSelectElement;
          body.currency_id = Number(target.value);
        }}
      >
        {#each mocked.currencies as currency}
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
    @import './styles.css';
</style>
