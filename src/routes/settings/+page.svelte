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
  import { configurationUpdate } from "$lib/data/api"
  import type { Response } from "$lib/types/response"
  import { onMount } from "svelte"
  import type { User } from "$lib/types/identity"
  import { STYLES } from "$lib/constants"

  const isMobile = persistent.mobileDevice

  let newCostSnippet: string = $state("")
  let newIncomeSnippet: string = $state("")
  let defaultCurrencyId: number | null = $state(null)
  let defaultCostCategoryId: number | null = $state(null)

  const dataLoaded: boolean = $derived(
    persistent.identity && persistent.currencies && persistent.costCategories
      ? true
      : false
  )

  onMount(() => {
    // update cost category if available in settings
    if (persistent.identity?.user.configuration.defaultCostCategory) {
      defaultCostCategoryId =
        persistent.identity.user.configuration.defaultCostCategory.id
    }
    if (persistent.identity?.user.configuration.defaultCurrency) {
      defaultCurrencyId =
        persistent.identity.user.configuration.defaultCurrency.id
    }
  })
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  <div class="flex flex-col">
    <div class={isMobile ? "flex items-end flex-col gap-5" : "flex gap-20"}>
      <!-- Default Currecy Selection Field -->
      <div
        class={isMobile
          ? "flex flex-col  gap-2 text-right w-full"
          : "flex flex-col items-center gap-2"}
      >
        <Selection
          bind:value={defaultCurrencyId}
          items={currenciesToSelectionItems(persistent.currencies!)}
          cleanOnSelect={false}
          onchangeCallback={async () => {
            if (persistent.identity) {
              const response: Response<User> = await configurationUpdate({
                defaultCurrencyId: defaultCurrencyId
                  ? defaultCurrencyId
                  : undefined,
              })
              persistent.identity = {
                accessToken: persistent.identity.accessToken,
                user: response.result,
              }
              notification({ message: "default currency changed" })
              persistent.flush()
            }
          }}
        />
        <span class="text-sm text-gray-300">default currency</span>
      </div>
      <!-- Default Cost Category Selection Field -->
      <div
        class={isMobile
          ? "flex flex-col  gap-2 text-right w-full"
          : "flex flex-col items-center gap-2"}
      >
        <Selection
          bind:value={defaultCostCategoryId}
          items={costCategoriesToSelectionItems(persistent.costCategories!)}
          cleanOnSelect={false}
          onchangeCallback={async () => {
            if (persistent.identity) {
              const response: Response<User> = await configurationUpdate({
                defaultCostCategoryId: defaultCostCategoryId
                  ? defaultCostCategoryId
                  : undefined,
              })
              persistent.identity = {
                accessToken: persistent.identity.accessToken,
                user: response.result,
              }
              notification({ message: "default cost category changed" })
              persistent.flush()
            }
          }}
        />
        <span class="text-sm text-gray-300">default cost category</span>
      </div>
      <!-- Notifications Threshold  Input Field -->
      <div
        class={isMobile
          ? "flex flex-col gap-2 text-right w-full"
          : "flex flex-col items-center gap-2"}
      >
        <Input
          bind:value={
            persistent.identity!.user.configuration.notifyCostThreshold
          }
          type="text"
          placeholder="value..."
          styles={`px-8 py-3 outline-none border-3 rounded-md ${isMobile ? "flex flex-col  gap-2 text-right w-full" : "w-40"}"`}
          onchangeCallback={async () => {
            await configurationUpdate({
              notifyCostThreshold:
                persistent.identity!.user.configuration.notifyCostThreshold,
            })
            notification({
              message: "updated cost notification threshold",
              icon: "🛎️",
            })
            persistent.flush()
          }}
        />
        <span class="text-sm text-gray-300 ml-2"
          >cost notification threshold</span
        >
      </div>
      <!-- Show Equity Toogle Button -->
      <div class="flex flex-col items-center justify-between">
        <ToggleButton
          bind:checked={persistent.identity!.user.configuration.showEquity}
          onchangeCallback={async () => {
            await configurationUpdate({
              showEquity: persistent.identity!.user.configuration.showEquity,
            })
            persistent.identity!.user.configuration.showEquity
              ? notification({ message: "equity is shown", icon: "👀" })
              : notification({ message: "equity is hidden", icon: "🥷" })
            persistent.flush()
          }}
        />
        <span class="text-sm text-gray-300 ml-2">show equity</span>
      </div>

      {#if !isMobile}
        <Button
          title="sign out"
          styles={`w-30 h-15 rounded-lg cursor-pointer ${STYLES.bgColor["red"]}`}
          onclick={async () => {
            persistent.unauthorize()
          }}
        />
      {/if}
    </div>

    <hr class="border-gray-600 my-10" />

    <!-- Cost Snippets Section -->
    <section class={isMobile ? "flex flex-col" : "flex justify-between mx-20"}>
      <div
        class={isMobile ? "flex flex-wrap gap-3" : "flex flex-wrap gap-2 mb-4"}
      >
        {#each persistent.identity!.user.configuration.costSnippets as item}
          <Badge
            content={item}
            onclick={async () => {
              persistent.identity!.user.configuration.costSnippets =
                persistent.identity!.user.configuration.costSnippets.filter(
                  (element) => element != item
                )
              await configurationUpdate({
                costSnippets:
                  persistent.identity!.user.configuration.costSnippets,
              })
              notification({
                message: `removed cost snippet ${item}`,
                icon: "🗑️",
              })
              persistent.flush()
            }}
          />
        {/each}
      </div>
      <div
        class={isMobile ? "flex gap-3 mt-3" : "flex flex-col w-72 mx-3 gap-3"}
      >
        <Input bind:value={newCostSnippet} placeholder="cost..." />
        <Button
          title="add"
          color="green"
          onclick={async () => {
            persistent.identity!.user.configuration.costSnippets.push(
              newCostSnippet
            )
            await configurationUpdate({
              costSnippets:
                persistent.identity!.user.configuration.costSnippets,
            })
            notification({ message: "added cost snippet", icon: "✔️" })
            newCostSnippet = ""
            persistent.flush()
          }}
          styles={`px-4 py-4 rounded-lg cursor-pointer bg-emerald-800 ${isMobile ? "w-full" : "w-72 "}`}
        />
      </div>
    </section>

    <hr class="border-gray-600 my-10" />

    <!-- Income Snippets Section -->
    <section class={isMobile ? "flex flex-col" : "flex justify-between mx-20"}>
      <div
        class={isMobile ? "flex flex-wrap gap-3" : "flex flex-wrap gap-2 mb-4"}
      >
        {#each persistent.identity!.user.configuration.incomeSnippets as item}
          <Badge
            content={item}
            onclick={async () => {
              persistent.identity!.user.configuration.incomeSnippets =
                persistent.identity!.user.configuration.incomeSnippets.filter(
                  (element) => element != item
                )
              await configurationUpdate({
                incomeSnippets:
                  persistent.identity!.user.configuration.incomeSnippets,
              })
              notification({ message: `removed snippet ${item}`, icon: "🗑️" })
              persistent.flush()
            }}
          />
        {/each}
      </div>

      <div
        class={isMobile ? "flex gap-3 mt-3" : "flex flex-col gap-3 w-72 mx-3"}
      >
        <Input bind:value={newIncomeSnippet} placeholder="income..." />
        <Button
          title="add"
          color="green"
          onclick={async () => {
            persistent.identity!.user.configuration.incomeSnippets.push(
              newIncomeSnippet
            )
            await configurationUpdate({
              incomeSnippets:
                persistent.identity!.user.configuration.incomeSnippets,
            })
            notification({ message: "added income snippet" })
            persistent.flush()
            newIncomeSnippet = ""
          }}
          styles="w-72 px-4 py-4 rounded-lg cursor-pointer bg-emerald-800"
        />
      </div>
    </section>
  </div>

  <!-- Sign Out Button -->
  {#if isMobile}
    <hr class="border-gray-600 my-10" />

    <Button
      title="sign out"
      color="red"
      onclick={async () => {
        persistent.unauthorize()
      }}
    />
  {/if}

  {#if isMobile}
    <div class="mb-30"></div>
  {/if}
{/if}
