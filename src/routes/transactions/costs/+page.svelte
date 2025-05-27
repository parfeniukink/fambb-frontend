<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import { costCreate } from "$lib/data/api"
  import {
    costCategoriesToSelectionItems,
    stringsToSelectionItems,
    currenciesToSelectionItems,
  } from "../shared"
  import DateButtons from "$lib/components/DateButtons.svelte"
  import { persistent } from "$lib/data/persistent.svelte"
  import { notification } from "$lib/services/notifications"
  import { today } from "$lib/infrastructure/datetime"

  const dataLoaded: boolean = $derived(
    persistent.identity && persistent.costCategories && persistent.currencies
      ? true
      : false
  )

  // create cost shortcut request body
  class RequestBody {
    name: string | null = $state(null)
    value: number | null = $state(null)
    timestamp: string = $state(today())
    currencyId: number | null = $state(persistent.defulatCurrencyId)
    categoryId: number | null = $state(persistent.defulatCostCategoryId)

    // note: date does not change on reset
    reset(): void {
      this.name = null
      this.value = null
      this.categoryId = persistent.defulatCurrencyId
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
        costCreate({
          name: this.name!,
          value: this.value!,
          timestamp: this.timestamp,
          currencyId: this.currencyId!,
          categoryId: this.categoryId!,
        })
      }
    }
  }
  const requestBody = new RequestBody()
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <main class="ml-10 text-center">
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
            items={costCategoriesToSelectionItems(persistent.costCategories!)}
          />
        </div>
        <div class="flex gap-4">
          <Input bind:value={requestBody.name} placeholder="name..." />
          <Selection
            bind:value={requestBody.name}
            items={stringsToSelectionItems(
              persistent.identity!.user.configuration.costSnippets
            )}
            width="24"
            cleanOnSelect={true}
          />
        </div>
        <div class="flex gap-4">
          <DecimalInput bind:value={requestBody.value} placeholder="value..." />
          <Selection
            bind:value={requestBody.currencyId}
            items={currenciesToSelectionItems(persistent.currencies!)}
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
              try {
                await requestBody.save()
                requestBody.reset()
                notification({ message: "Cost saved" })
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
  </main>
{/if}
