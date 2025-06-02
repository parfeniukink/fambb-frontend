<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import type { IncomeSource, Currency, SelectionItem } from "$lib/types/money"
  import { incomeCreate } from "$lib/data/api"
  import DateButtons from "$lib/components/DateButtons.svelte"
  import { persistent } from "$lib/data/persistent.svelte"
  import { goto } from "$app/navigation"
  import { notification } from "$lib/services/notifications"
  import { today } from "$lib/infrastructure/datetime"
  import { stringsToSelectionItems } from "../shared"
  import { INCOME_SOURCES } from "$lib/constants"

  const isMobile = persistent.mobileDevice
  const dataLoaded: boolean = $derived(
    persistent.identity && persistent.currencies ? true : false
  )

  class RequestBody {
    name: string | null = $state(null)
    value: number | null = $state(null)
    source: IncomeSource = $state("revenue")
    timestamp: string = $state(today())
    currencyId: number | null = $state(persistent.defulatCurrencyId)

    // note: date does not change on reset
    reset(): void {
      this.name = null
      this.value = null
      this.source = "revenue"
      this.currencyId = persistent.defulatCurrencyId
    }

    async save(): Promise<void> {
      const requiredFields = []

      if (!this.name) requiredFields.push("name")
      if (!this.value) requiredFields.push("value")
      if (!this.currencyId) requiredFields.push("currency")

      if (requiredFields.length > 0) {
        throw new Error(`fields ${requiredFields.join(", ")} are required`)
      } else {
        incomeCreate({
          name: this.name!,
          value: this.value!,
          source: this.source,
          timestamp: this.timestamp,
          currencyId: this.currencyId!,
        })
      }
    }
  }
  const requestBody = new RequestBody()

  // selection items
  function currenciesToSelectionItems(items: Currency[]): SelectionItem[] {
    return items.map((item) => ({ value: item.id, content: item.sign }))
  }
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <Box
    title="Add Income"
    titleCenter={true}
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
      <div class="w-full">
        <Selection
          bind:value={requestBody.source}
          items={INCOME_SOURCES.map((item) => {
            return {
              value: item,
              content: item,
            }
          })}
        />
      </div>

      <div class="flex gap-4">
        <Input bind:value={requestBody.name} placeholder="name..." />
        <Selection
          bind:value={requestBody.name}
          items={stringsToSelectionItems(
            persistent.identity!.user.configuration.incomeSnippets
          )}
          width={24}
          cleanOnSelect={true}
        />
      </div>
      <div class="flex gap-4">
        <DecimalInput bind:value={requestBody.value} placeholder="value..." />
        <Selection
          bind:value={requestBody.currencyId}
          items={currenciesToSelectionItems(persistent.currencies!)}
          width={24}
        />
      </div>
      <div class="flex gap-4 mt-4">
        <Button
          title="reset"
          color="red"
          onclick={() => requestBody.reset()}
          size={isMobile ? "large" : "default"}
        />
        <Button
          title="save"
          size={isMobile ? "large" : "default"}
          color="green"
          onclick={async () => {
            try {
              await requestBody.save()
              notification({ message: "Income saved" })
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
