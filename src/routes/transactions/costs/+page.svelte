<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import {
    CURRENCIES,
    COST_SNIPPETS,
    COST_CATEGORIES,
    costCreate,
  } from "$lib/data/api"
  import {
    costCategoriesToSelectionItems,
    CostSnippetsToSelectionItems,
    currenciesToSelectionItems,
  } from "../shared"
  import DateButtons from "$lib/components/DateButtons.svelte"

  // used if user selects name from dropdown
  let selectedCostSnippetIndex: number | null = $state(null)

  // create cost shortcut request body
  class RequestBody {
    name: string | null = $state(null)
    value: number | null = $state(null)
    timestamp: string = $state(new Date().toISOString().slice(0, 10))
    currencyId: number | null = $state(CURRENCIES[0].id)
    categoryId: number = $state(COST_CATEGORIES[0].id)

    // note: date does not change on reset
    reset() {
      this.name = null
      this.value = null
      this.categoryId = COST_CATEGORIES[0].id
      this.currencyId = CURRENCIES[0].id
    }

    save() {
      if (!this.name || !this.value || !this.currencyId) {
        let requiredFields = []

        if (!this.name) {
          requiredFields.push("name")
        }
        if (!this.value) {
          requiredFields.push("value")
        }
        if (!this.currencyId) {
          requiredFields.push("currency")
        }

        // todo: push the notification instead of console log
        const message = `fields: [${requiredFields.join(", ")}] are required`
        throw Error(message)
      } else {
        const payload = {
          name: this.name!,
          value: this.value!,
          timestamp: this.timestamp,
          currencyId: this.currencyId!,
          categoryId: this.categoryId,
        }

        costCreate(payload)
      }
    }
  }
  const requestBody = new RequestBody()
</script>

<main class="flex justify-center text-center">
  <Box title="Add Cost" width={120} border={4} padding="default">
    <div class="flex flex-col gap-6">
      <div class="w-full mt-4 flex">
        <input
          type="date"
          bind:value={requestBody.timestamp}
          class="px-8 py-3 outline-none border-3 rounded-md w-56"
        />
        <DateButtons bind:value={requestBody.timestamp} />
      </div>
      <div class="w-full">
        <Selection
          bind:value={requestBody.categoryId}
          items={costCategoriesToSelectionItems(COST_CATEGORIES)}
        />
      </div>
      <div class="flex gap-4">
        <Input bind:value={requestBody.name} placeholder="name..." />
        <Selection
          bind:value={requestBody.name}
          items={CostSnippetsToSelectionItems(COST_SNIPPETS)}
          width="24"
          cleanOnSelect={true}
        />
      </div>
      <div class="flex gap-4">
        <DecimalInput bind:value={requestBody.value} placeholder="value..." />
        <Selection
          bind:value={requestBody.currencyId}
          items={currenciesToSelectionItems(CURRENCIES)}
          width="24"
        />
      </div>
      <div class="flex gap-4 mt-4">
        <Button
          title="reset"
          color="red"
          onclick={() => {
            requestBody.reset()
          }}
        />
        <Button
          title="save"
          color="green"
          onclick={async () => {
            requestBody.save()
          }}
        />
      </div>
    </div>
  </Box>
</main>
