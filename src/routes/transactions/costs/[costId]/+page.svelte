<script lang="ts">
  import { page } from "$app/state"
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import DateButtons from "$lib/components/DateButtons.svelte"
  import type { Cost, CostPartialUpdateRequestBody } from "$lib/types/money"
  import { costDelete, costRetrieve, costUpdate } from "$lib/data/api"
  import {
    costCategoriesToSelectionItems,
    stringsToSelectionItems,
    currenciesToSelectionItems,
  } from "../../shared"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import { notification } from "$lib/services/notifications"
  import { persistent } from "$lib/data/persistent.svelte"

  const costId = Number(page.params.costId)
  let cost: Cost | null = $state(null)

  const dataLoaded: boolean = $derived(
    cost &&
      persistent.identity &&
      persistent.costCategories &&
      persistent.currencies
      ? true
      : false
  )

  class RequestBody {
    name: string | null = $state(null)
    value: number | null = $state(null)
    timestamp: string = $state(new Date().toISOString().slice(0, 10))
    currencyId: number | null = $state(null)
    categoryId: number | null = $state(null)

    updateFromCost(cost: Cost) {
      this.name = cost.name
      this.value = cost.value
      this.timestamp = cost.timestamp
      this.currencyId = cost.currency.id
      this.categoryId = cost.category.id
    }

    valid() {
      return (
        this.name &&
        this.value &&
        this.timestamp &&
        this.currencyId &&
        this.categoryId
      )
    }

    partialUpdatePayload(): CostPartialUpdateRequestBody {
      const payload: Record<string, any> = {}

      if (!cost) return payload

      if (this.name !== cost.name) payload.name = this.name
      if (this.value !== cost.value) payload.value = this.value
      if (this.timestamp !== cost.timestamp) payload.timestamp = this.timestamp
      if (this.currencyId !== cost.currency.id)
        payload.currencyId = this.currencyId
      if (this.categoryId !== cost.category.id)
        payload.categoryId = this.categoryId

      return payload as CostPartialUpdateRequestBody
    }
  }
  const requestBody = new RequestBody()

  onMount(async () => {
    // get costId from page params
    cost = (await costRetrieve(costId)).result
    requestBody.updateFromCost(cost)
  })
</script>

{#if !dataLoaded}
  <main>loading...</main>
{:else}
  <main class="ml-10 text-center">
    <Box title="Edit Cost" width={120} border={4} padding="default">
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
            title="delete"
            color="red"
            onclick={async () => {
              goto("/")
              await costDelete(cost!.id)
              notification({
                message: `Cost ${cost!.name} deleted`,
                icon: "🗑️",
              })
              // todo: update transactions history data
            }}
          />
          <Button
            title="save"
            color="green"
            onclick={() => {
              goto("/")
              if (!requestBody.valid()) {
                notification({ message: "Invalid Cost Data", icon: "⚠️" })
              } else {
                costUpdate(costId, requestBody.partialUpdatePayload())
                notification({ message: `cost ${cost!.name} saved` })
              }
            }}
          />
        </div>
      </div>
    </Box>
  </main>
{/if}
