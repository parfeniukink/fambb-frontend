<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import type { ExchangeCreateRequestBody } from "$lib/types/money"
  import { CURRENCIES, exchangeCreate } from "$lib/data/api"
  import DateButtons from "$lib/components/DateButtons.svelte"
  import { currenciesToSelectionItems } from "../shared"

  class RequestBody {
    fromValue: number | null = $state(null)
    toValue: number | null = $state(null)
    fromCurrencyId: number | null = $state(CURRENCIES[0].id)
    toCurrencyId: number | null = $state(CURRENCIES[1].id)
    timestamp: string = $state(new Date().toISOString().slice(0, 10))

    reset() {
      // keep timestamp
      this.fromValue = null
      this.toValue = null
      this.fromCurrencyId = CURRENCIES[0].id
      this.toCurrencyId = CURRENCIES[1].id
    }

    validate(): ExchangeCreateRequestBody {
      const requiredFields = []
      if (this.fromValue === null || this.fromValue === undefined)
        requiredFields.push("fromValue")
      if (this.toValue === null || this.toValue === undefined)
        requiredFields.push("toValue")
      if (!this.fromCurrencyId) requiredFields.push("fromCurrency")
      if (!this.toCurrencyId) requiredFields.push("toCurrency")

      if (requiredFields.length > 0) {
        throw new Error(`fields: [${requiredFields.join(", ")}] are required`)
      }

      return {
        fromValue: this.fromValue!,
        toValue: this.toValue!,
        fromCurrencyId: this.fromCurrencyId!,
        toCurrencyId: this.toCurrencyId!,
        timestamp: this.timestamp,
      }
    }
  }

  let requestBody = new RequestBody()
</script>

<main class="flex justify-center text-center">
  <Box title="Add Exchange" width={120} border={4} padding="default">
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
        <DecimalInput
          bind:value={requestBody.fromValue}
          placeholder="from value..."
        />
        <Selection
          bind:value={requestBody.fromCurrencyId}
          items={currenciesToSelectionItems(CURRENCIES)}
          width="24"
        />
      </div>
      <div class="flex gap-4">
        <DecimalInput
          bind:value={requestBody.toValue}
          placeholder="to value..."
        />
        <Selection
          bind:value={requestBody.toCurrencyId}
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
              await exchangeCreate(payload)
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
