<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import type { CostCategory, Currency, SelectionItem } from "$lib/types/money"
  import {
    COST_CATEGORIES,
    COST_SNIPPETS,
    costShortcutCreate,
    CURRENCIES,
  } from "$lib/data/api"

  class RequestBody {
    name: string | null = $derived(
      selectedCostSnippetIndex ? COST_SNIPPETS[selectedCostSnippetIndex] : null
    )
    value: number | null = $state(null)
    currencyId: number | null = $state(CURRENCIES[0].id)
    categoryId: number = $state(COST_CATEGORIES[0].id)

    reset() {
      this.name = null
      this.value = null
      this.categoryId = COST_CATEGORIES[0].id
      this.currencyId = CURRENCIES[0].id
    }

    validate() {
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
        return {
          name: this.name!,
          value: this.value!,
          currencyId: this.currencyId!,
          categoryId: this.categoryId,
        }
      }
    }
  }

  let selectedCostSnippetIndex: number | null = $state(null)
  let requestBody = new RequestBody()

  function costCategoriesToSelectionItems(
    items: CostCategory[]
  ): SelectionItem[] {
    return items.map((item) => ({ value: item.id, content: item.name }))
  }

  function CostSnippetsToSelectionItems(items: string[]): SelectionItem[] {
    return items.map((item, index) => ({ value: index, content: item }))
  }
  function currenciesToSelectionItems(items: Currency[]): SelectionItem[] {
    return items.map((item) => ({ value: item.id, content: item.sign }))
  }
</script>

<main class="flex justify-center text-center">
  <Box title="Add Cost Shortcut" width={120} border={4} padding="default">
    <div class="flex flex-col gap-6">
      <div class="w-full">
        <Selection
          bind:value={requestBody.categoryId}
          items={costCategoriesToSelectionItems(COST_CATEGORIES)}
        />
      </div>
      <div class="flex gap-4">
        <Input bind:value={requestBody.name} placeholder="name..." />
        <Selection
          bind:value={selectedCostSnippetIndex}
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
        <Button title="reset" color="red" onclick={() => requestBody.reset()} />
        <Button
          title="save"
          color="green"
          onclick={() => {
            costShortcutCreate(requestBody.validate())
          }}
        />
      </div>
    </div>
  </Box>
</main>
