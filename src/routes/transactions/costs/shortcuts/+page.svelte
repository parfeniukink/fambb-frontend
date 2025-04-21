<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import type { CostCategory, Currency, SelectionItem } from "$lib/types/money"

  const CURRENCIES: Currency[] = [
    {
      id: 1,
      name: "USD",
      sign: "$",
    },
    {
      id: 2,
      name: "UAH",
      sign: "₴",
    },
  ]
  const COST_CATEGORIES: CostCategory[] = [
    { id: 1, name: "Food" },
    { id: 2, name: "Transport" },
    { id: 3, name: "Utilities" },
    { id: 4, name: "Entertainment" },
    { id: 5, name: "Health" },
  ]
  const COST_SNIPPETS: string[] = ["Water", "Welmart", "Pizza", "Other"]

  class RequestBody {
    costName: string | null = $derived(
      selectedCostSnippetIndex ? COST_SNIPPETS[selectedCostSnippetIndex] : null
    )
    categoryId: number = $state(COST_CATEGORIES[0].id)
    value: number | null = $state(null)
    currencyId: number | null = $state(CURRENCIES[0].id)
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
        <Input bind:value={requestBody.costName} placeholder="name..." />
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
        <Button
          title="reset"
          color="red"
          onclick={() => {
            console.log("RESET")
          }}
        />
        <Button
          title="save"
          color="green"
          onclick={() => {
            console.log("SAVE")
          }}
        />
      </div>
    </div>
  </Box>
</main>
