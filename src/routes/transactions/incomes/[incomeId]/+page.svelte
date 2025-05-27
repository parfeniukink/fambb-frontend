<script lang="ts">
  import { page } from "$app/state"
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import DateButtons from "$lib/components/DateButtons.svelte"
  import type {
    Income,
    IncomePartialUpdateRequestBody,
    IncomeSource,
  } from "$lib/types/money"
  import { incomeRetrieve, incomeUpdate, incomeDelete } from "$lib/data/api"
  import {
    currenciesToSelectionItems,
    stringsToSelectionItems,
  } from "../../shared"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import { notification } from "$lib/services/notifications"
  import { INCOME_SOURCES } from "$lib/constants"
  import { persistent } from "$lib/data/persistent.svelte"

  const incomeId = Number(page.params.incomeId)
  let income: Income | null = $state(null)

  const dataLoaded: boolean = $derived(
    income && persistent.identity && persistent.currencies ? true : false
  )

  class RequestBody {
    name: string | null = $state(null)
    value: number | null = $state(null)
    source: IncomeSource = $state("revenue")
    timestamp: string = $state(new Date().toISOString().slice(0, 10))
    currencyId: number | null = $state(null)

    updateFromIncome(income: Income) {
      this.name = income.name
      this.value = income.value
      this.source = income.source
      this.timestamp = income.timestamp
      this.currencyId = income.currency.id
    }

    valid() {
      return (
        this.name &&
        this.value &&
        this.timestamp &&
        this.currencyId &&
        this.source
      )
    }

    partialUpdatePayload(): IncomePartialUpdateRequestBody {
      const payload: Record<string, any> = {}

      if (!income) return payload

      if (this.name !== income.name) payload.name = this.name
      if (this.value !== income.value) payload.value = this.value
      if (this.timestamp !== income.timestamp)
        payload.timestamp = this.timestamp
      if (this.currencyId !== income.currency.id)
        payload.currencyId = this.currencyId
      if (this.source !== income.source) payload.source = this.source

      return payload as IncomePartialUpdateRequestBody
    }
  }
  const requestBody = new RequestBody()

  onMount(async () => {
    // get incomeId from page params
    income = (await incomeRetrieve(incomeId)).result
    requestBody.updateFromIncome(income)
  })
</script>

{#if !dataLoaded}
  <main>loading...</main>
{:else}
  <main class="ml-10 text-center">
    <Box title="Edit Income" width={120} border={4} padding="default">
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
            bind:value={requestBody.source}
            items={stringsToSelectionItems(INCOME_SOURCES)}
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
            width="24"
          />
        </div>
        <div class="flex gap-4 mt-4">
          <Button
            title="delete"
            color="red"
            onclick={() => {
              goto("/")
              incomeDelete(income!.id)
              notification({
                message: `Income ${income!.name} deleted`,
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
                notification({ message: "Invalid Income Data", icon: "⚠️" })
              } else {
                incomeUpdate(incomeId, requestBody.partialUpdatePayload())
                notification({ message: `Income ${income!.name} saved` })
              }
            }}
          />
        </div>
      </div>
    </Box>
  </main>
{/if}
