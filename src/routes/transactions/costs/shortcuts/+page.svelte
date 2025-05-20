<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import DecimalInput from "$lib/components/DecimalInput.svelte"
  import type {
    CostCategory,
    Currency,
    SelectionItem,
    CostShortcut,
  } from "$lib/types/money"
  import { costShortcutCreate } from "$lib/data/api"
  import { persistent } from "$lib/data/persistent.svelte"
  import { goto } from "$app/navigation"
  import { notification } from "$lib/services/notifications"
  import { stringsToSelectionItems } from "../../shared"
  import type { Response } from "$lib/types/response"

  const dataLoaded: boolean = $derived(
    persistent.identity && persistent.costCategories && persistent.currencies
      ? true
      : false
  )

  class RequestBody {
    name: string | null = $state(null)
    value: number | null = $state(null)
    currencyId: number | null = $state(persistent.defulatCurrencyId)
    categoryId: number | null = $state(persistent.defulatCostCategoryId)

    reset(): void {
      this.name = null
      this.value = null
      this.currencyId = persistent.defulatCurrencyId
      this.categoryId = persistent.defulatCostCategoryId
    }

    async save(): Promise<CostShortcut> {
      const requiredFields = []

      if (!this.name) requiredFields.push("name")
      if (!this.currencyId) requiredFields.push("currency")
      if (!this.categoryId) requiredFields.push("category")

      if (requiredFields.length > 0) {
        throw new Error(`fields ${requiredFields.join(", ")} are required`)
      } else {
        const response: Response<CostShortcut> = await costShortcutCreate({
          name: this.name!,
          value: this.value,
          currencyId: this.currencyId!,
          categoryId: this.categoryId!,
        })
        return response.result
      }
    }
  }

  let requestBody = new RequestBody()

  function costCategoriesToSelectionItems(
    items: CostCategory[]
  ): SelectionItem[] {
    return items.map((item) => ({ value: item.id, content: item.name }))
  }

  function currenciesToSelectionItems(items: Currency[]): SelectionItem[] {
    return items.map((item) => ({ value: item.id, content: item.sign }))
  }
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <main class="ml-10 text-center">
    <Box title="Add Cost Shortcut" width={120} border={4} padding="default">
      <div class="flex flex-col gap-6">
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
            onclick={() => requestBody.reset()}
          />
          <Button
            title="save"
            color="green"
            onclick={async () => {
              try {
                const instance: CostShortcut = await requestBody.save()
                goto("/")
                notification("Cost shortcut saved")
                persistent.costShortcuts!.push(instance)
                persistent.flush()
              } catch (error) {
                notification(`${error ?? "something went wrong"}`, "❌", 5000)
              }
            }}
          />
        </div>
      </div>
    </Box>
  </main>
{/if}
