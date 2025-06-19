<script lang="ts">
  import CostShortcutComponent from "$lib/components/CostShortcut.svelte"
  import { persistent } from "$lib/data/persistent.svelte"
  import type { CostShortcut } from "$lib/types/money"
  import { costShortcutApply } from "$lib/data/api"
  import { notification } from "$lib/services/notifications"
  import { prettyMoney } from "$lib/services/finances"
  import { goto } from "$app/navigation"

  const isMobile = persistent.mobileDevice

  // cost shortcuts section
  let costShortcutToApply: CostShortcut | null = $state(null)

  async function handleConfirmShortcutValue() {
    if (costShortcutToApply && costShortcutToApply.value) {
      costShortcutApply(costShortcutToApply.id, {
        value: costShortcutToApply.value,
      })
      notification({
        message: `saved, ${costShortcutToApply!.name} ${costShortcutToApply!.value}${costShortcutToApply!.currency.sign}`,
      })
    } else {
      notification({ message: "not saved" })
    }
    costShortcutToApply = null
  }
</script>

{#if !persistent.authenticated}
  <p>loading data...</p>
{:else if !isMobile}
  <p>are you mad? this page is available only for the mobile application</p>
{:else}
  <div class="flex flex-wrap gap-y-5 justify-around">
    {#each persistent.costShortcuts! as shortcut}
      <CostShortcutComponent
        onclick={async () => {
          if (!shortcut.value) {
            costShortcutToApply = { ...shortcut }
          } else {
            await costShortcutApply(shortcut.id)
            notification({
              message: `saved, ${shortcut.name} ${shortcut.value}${shortcut.currency.sign}`,
            })
          }
        }}
      >
        <h4>{shortcut.name}</h4>
        <p class="mb-4 italic text-xs">{shortcut.category.name}</p>
        <p class="italic text-xs">
          {shortcut.value ? prettyMoney(shortcut.value) : "..."}
          {shortcut.currency.sign}
        </p>
      </CostShortcutComponent>
    {/each}
    <button
      type="button"
      class="border-2 p-2 w-40 rounded-md italic text-xl hover:bg-emerald-800 cursor-pointer"
      onclick={() => {
        goto("/transactions/costs/shortcuts/create")
      }}>➕</button
    >
  </div>

  <div class="mb-20"></div>

  <!-- Modal With Input Value -->
  {#if costShortcutToApply !== null}
    <div
      class="fixed inset-0 flex items-center justify-center bg-[#3a342e] z-50"
      onclick={() => {
        costShortcutToApply = null
      }}
    >
      <div
        class="bg-transparent rounded p-6 flex flex-col gap-3 justify-center items-center"
      >
        <input
          type="text"
          inputmode="decimal"
          pattern="\d*"
          bind:value={costShortcutToApply.value}
          class="border rounded-md w-full h-12 p-3 hover:border-amber-300"
          autofocus
        />
        <button
          onclick={handleConfirmShortcutValue}
          class="w-full h-12 rounded-md bg-orange-700 hover:cursor-pointer"
          >Confirm</button
        >
      </div>
    </div>
  {/if}
{/if}
