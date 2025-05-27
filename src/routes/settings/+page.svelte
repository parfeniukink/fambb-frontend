<script lang="ts">
  import Selection from "$lib/components/Selection.svelte"
  import Input from "$lib/components/Input.svelte"
  import Button from "$lib/components/Button.svelte"
  import Badge from "$lib/components/Badge.svelte"
  import { persistent } from "$lib/data/persistent.svelte"
  import { notification } from "$lib/services/notifications"
  import {
    costCategoriesToSelectionItems,
    currenciesToSelectionItems,
  } from "../transactions/shared"
  import ToggleButton from "$lib/components/ToggleButton.svelte"

  const dataLoaded: boolean = $derived(
    persistent.identity && persistent.currencies && persistent.costCategories
      ? true
      : false
  )

  let newCostSnippet: string = $state("")
  let newIncomeSnippet: string = $state("")
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <main class="flex flex-col">
    <div class="flex gap-20">
      <div class="flex flex-col items-center gap-2">
        <Selection
          bind:value={persistent.defulatCurrencyId}
          items={currenciesToSelectionItems(persistent.currencies!)}
          width="full"
          cleanOnSelect={false}
          onchangeCallback={() => {
            notification({ message: "default currency changed" })
            persistent.flush()
          }}
        />
        <span class="text-sm text-gray-300">default currency</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Selection
          bind:value={persistent.defulatCostCategoryId}
          items={costCategoriesToSelectionItems(persistent.costCategories!)}
          width="full"
          cleanOnSelect={false}
          onchangeCallback={() => {
            // todo: api call
            persistent.flush()
            notification({ message: "default cost category changed" })
          }}
        />
        <span class="text-sm text-gray-300">default cost category</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Input
          bind:value={
            persistent.identity!.user.configuration.notifyCostThreshold
          }
          type="text"
          placeholder="value..."
          styles="px-8 py-3 outline-none border-3 rounded-md w-40"
          onchangeCallback={() => {
            // todo: api call
            persistent.flush()
            notification({
              message: "updated cost notification threshold",
              icon: "🛎️",
            })
          }}
        />
        <span class="text-sm text-gray-300 ml-2"
          >cost notification threshold</span
        >
      </div>
      <div class="flex flex-col items-center justify-between">
        <ToggleButton
          bind:checked={persistent.identity!.user.configuration.showEquity}
          onchangeCallback={() => {
            // todo: api call
            persistent.identity!.user.configuration.showEquity
              ? notification({ message: "equity is shown", icon: "👀" })
              : notification({ message: "equity is hidden", icon: "🥷" })
            persistent.flush()
          }}
        />
        <span class="text-sm text-gray-300 ml-2">show equity</span>
      </div>
    </div>

    <hr class="border-gray-600 my-10" />

    <section class="flex justify-between mx-10">
      <div class="flex flex-wrap gap-2 mb-4">
        {#each persistent.identity!.user.configuration.costSnippets as item}
          <Badge
            content={item}
            onclick={() => {
              // todo: perform API call
              notification({ message: `remove cost ${item}`, icon: "✔️" })
              persistent.identity!.user.configuration.costSnippets =
                persistent.identity!.user.configuration.costSnippets.filter(
                  (element) => element != item
                )
            }}
          />
        {/each}
      </div>
      <div class="flex flex-col gap-2 w-72">
        <Input bind:value={newCostSnippet} placeholder="cost..." />
        <Button
          title="add"
          color="green"
          onclick={async () => {
            // todo: api call
            persistent.identity!.user.configuration.costSnippets.push(
              newCostSnippet
            )
            newCostSnippet = ""
            notification({ message: "Add Cost Snippet" })
          }}
          styles="w-72 px-4 py-4 rounded-lg cursor-pointer bg-emerald-800"
        />
      </div>
    </section>

    <hr class="border-gray-600 my-10" />

    <section class="flex justify-between mx-10">
      <div class="flex flex-wrap gap-2 mb-4">
        {#each persistent.identity!.user.configuration.incomeSnippets as item}
          <Badge
            content={item}
            onclick={() => {
              // todo: api call
              notification({ message: `remove snippet ${item}`, icon: "✔️" })
              persistent.identity!.user.configuration.incomeSnippets =
                persistent.identity!.user.configuration.incomeSnippets.filter(
                  (element) => element != item
                )
            }}
          />
        {/each}
      </div>
      <div class="flex flex-col gap-2 w-72">
        <Input bind:value={newIncomeSnippet} placeholder="income..." />
        <Button
          title="add"
          color="green"
          onclick={async () => {
            // todo: api call
            persistent.identity!.user.configuration.incomeSnippets.push(
              newIncomeSnippet
            )
            newIncomeSnippet = ""
            notification({ message: "Add Income Snippet" })
          }}
          styles="w-72 px-4 py-4 rounded-lg cursor-pointer bg-emerald-800"
        />
      </div>
    </section>
  </main>
{/if}
