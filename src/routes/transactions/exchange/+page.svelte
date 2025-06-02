<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import { exchangeCreate } from "$lib/data/api"
  import DateButtons from "$lib/components/DateButtons.svelte"
  import { currenciesToSelectionItems } from "../shared"
  import { persistent } from "$lib/data/persistent.svelte"
  import type { Currency } from "$lib/types/money"
  import { today } from "$lib/infrastructure/datetime"
  import { notification } from "$lib/services/notifications"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"

  const isMobile = persistent.mobileDevice
  const dataLoaded: boolean = $derived(
    persistent.identity && persistent.currencies ? true : false
  )

  class RequestBody {
    fromValue: number | null = $state(null)
    toValue: number | null = $state(null)
    fromCurrencyId: number | null = $state(persistent.defulatCurrencyId)
    toCurrencyId: number | null = $state(
      this.getAnotherCurrency(
        persistent.currencies,
        persistent.defulatCurrencyId
      )
    )
    timestamp: string = $state(today())

    getAnotherCurrency(
      currencies: Currency[] | null,
      selectedCurrencyId: number | null
    ): number | null {
      if (!currencies || !selectedCurrencyId) {
        return null
      }

      for (let currency of currencies) {
        if (currency.id != selectedCurrencyId) {
          return currency.id
        }
      }

      return null
    }

    // note: date does not change on reset
    reset(): void {
      this.fromValue = null
      this.toValue = null
      this.fromCurrencyId = persistent.defulatCurrencyId
      this.toCurrencyId = this.getAnotherCurrency(
        persistent.currencies,
        persistent.defulatCurrencyId
      )
    }

    async save(): Promise<void> {
      const requiredFields = []

      if (!this.fromValue) requiredFields.push("fromValue")
      if (!this.toValue) requiredFields.push("toValue")
      if (!this.fromCurrencyId) requiredFields.push("fromCurrency")
      if (!this.toCurrencyId) requiredFields.push("toCurrency")

      if (requiredFields.length > 0) {
        throw new Error(`fields ${requiredFields.join(", ")} are required`)
      } else {
        exchangeCreate({
          fromValue: this.fromValue!,
          toValue: this.toValue!,
          fromCurrencyId: this.fromCurrencyId!,
          toCurrencyId: this.toCurrencyId!,
          timestamp: this.timestamp,
        })
      }
    }
  }
  const requestBody = new RequestBody()

  onMount(async () => {
    // validate if user has enough currencies to perform such an operation
    if (dataLoaded && persistent.currencies!.length < 2) {
      goto("/")
      notification({
        message: "Can't exchange. You must have at least 2 currencies",
        icon: "🚧",
        duration: 4000,
      })
    }
  })
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <Box
    title="Add Exchange"
    titleCenter={isMobile}
    width={isMobile ? 0 : 140}
    border={isMobile ? 0 : 4}
    padding={isMobile ? "small" : "default"}
  >
    <div class="flex flex-col gap-6">
      <div class={isMobile ? "w-full flex flex-col" : "w-full mt-4 flex"}>
        <DateButtons bind:value={requestBody.timestamp} />
        <input
          type="date"
          bind:value={requestBody.timestamp}
          class={isMobile
            ? "px-8 py-3 outline-none border-3 rounded-md"
            : "px-8 py-3 outline-none border-3 rounded-md w-56"}
        />
      </div>
      <div class="flex gap-4">
        <DecimalInput
          bind:value={requestBody.fromValue}
          placeholder="from value..."
        />
        <Selection
          bind:value={requestBody.fromCurrencyId}
          items={currenciesToSelectionItems(persistent.currencies!)}
          width={24}
        />
      </div>
      <div class="flex gap-4">
        <DecimalInput
          bind:value={requestBody.toValue}
          placeholder="to value..."
        />
        <Selection
          bind:value={requestBody.toCurrencyId}
          items={currenciesToSelectionItems(persistent.currencies!)}
          width={24}
        />
      </div>
      <div class="flex gap-4 mt-4">
        <Button
          title="reset"
          size={isMobile ? "large" : "default"}
          color="red"
          onclick={() => requestBody.reset()}
        />
        <Button
          title="save"
          size={isMobile ? "large" : "default"}
          color="green"
          onclick={async () => {
            try {
              await requestBody.save()
              notification({ message: "Exchange saved" })
              goto("/")
            } catch (error) {
              notification({
                message: `${error ?? "something went wrong"}`,
                icon: "❌",
                duration: 5000,
              })
            }
          }}
        />
      </div>
    </div>
  </Box>
{/if}
