<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import type {
    IncomeSource,
    Currency,
    SelectionItem,
    IncomeCreateRequestBody,
  } from "$lib/types/money"
  import { CURRENCIES, INCOME_SNIPPETS, incomeCreate } from "$lib/data/api"
  import DateButtons from "$lib/components/DateButtons.svelte"

  let selectedIncomeSnippetIndex: number | null = $state(null)

  class RequestBody {
    name: string | null = $derived(
      selectedIncomeSnippetIndex
        ? INCOME_SNIPPETS[selectedIncomeSnippetIndex]
        : null
    )
    value: number | null = $state(null)
    source: IncomeSource = $state("revenue")
    timestamp: string = $state(new Date().toISOString().slice(0, 10))
    currencyId: number | null = $state(CURRENCIES[0].id)

    reset() {
      this.name = null
      this.value = null
      this.source = "revenue"
      this.currencyId = CURRENCIES[0].id
    }

    validate(): IncomeCreateRequestBody {
      const requiredFields = []
      if (!this.name) requiredFields.push("name")
      if (this.value === null || this.value === undefined)
        requiredFields.push("value")
      if (!this.currencyId) requiredFields.push("currency")

      if (requiredFields.length > 0) {
        throw new Error(`fields: [${requiredFields.join(", ")}] are required`)
      }

      return {
        name: this.name!,
        value: this.value!,
        source: this.source,
        timestamp: this.timestamp,
        currencyId: this.currencyId!,
      }
    }
  }

  let requestBody = new RequestBody()

  // selection items
  function currenciesToSelectionItems(items: Currency[]): SelectionItem[] {
    return items.map((item) => ({ value: item.id, content: item.sign }))
  }
  const INCOME_SOURCES: IncomeSource[] = ["revenue", "gift", "debt", "other"]
</script>

<main class="flex justify-center text-center">
  <Box title="Add Income" width={120} border={4} padding="default">
    <div class="flex flex-col gap-6">
      <div class="w-full mt-4 flex">
        <input
          type="date"
          bind:value={requestBody.timestamp}
          class="px-8 py-3 outline-none border-3 rounded-md w-56"
        />
        <DateButtons bind:value={requestBody.timestamp} />
      </div>
      <div class="flex gap-4">
        <Input bind:value={requestBody.name} placeholder="name..." />
        <Selection
          bind:value={requestBody.source}
          items={INCOME_SOURCES.map((item) => {
            return {
              value: item,
              content: item,
            }
          })}
          width="24"
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
          onclick={async () => {
            try {
              const payload = requestBody.validate()
              requestBody.reset()
              incomeCreate(payload)
            } catch (e) {
              // TODO: show notification
              console.error(e)
            }
          }}
        />
      </div>
    </div>
  </Box>
</main>
