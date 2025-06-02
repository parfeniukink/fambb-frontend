<script lang="ts">
  import Box from "$lib/components/Box.svelte"
  import Button from "$lib/components/Button.svelte"
  import CostShortcutComponent from "$lib/components/CostShortcut.svelte"

  import type {
    Transaction,
    Equity,
    CostShortcut,
    Cost,
  } from "$lib/types/money"

  import {
    groupTransactionsByDate,
    prettyMoney,
    retrieveUrlFromTransaction,
  } from "$lib/services/finances"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import {
    costShortcutApply,
    costShortcutDelete,
    equityList,
    notificationsList,
    transactionsList,
  } from "$lib/data/api"
  import { STYLES, TRANSACTION_OPERATIONS_MAPPER } from "$lib/constants"
  import { persistent } from "$lib/data/persistent.svelte"
  import { notification } from "$lib/services/notifications"
  import type { Response } from "$lib/types/response"
  import type { Notification } from "$lib/types/notifications"

  // ─────────────────────────────────────────────────────────
  // detect platform
  // ─────────────────────────────────────────────────────────
  let isMobile: boolean = persistent.mobileDevice

  // ─────────────────────────────────────────────────────────
  // form the dataset to be provided as props to children
  // ─────────────────────────────────────────────────────────
  let equities: Equity[] | null = $state(null)
  let transactionsHistory: Transaction[] | null = $state(null)

  // cost shortcuts section
  let costShortcutToApply: CostShortcut | null = $state(null)

  let dataLoaded: boolean = $derived(
    persistent.identity && equities && transactionsHistory ? true : false
  )

  const groupedHistoryItems = $derived(
    groupTransactionsByDate(transactionsHistory!)
  )

  const mobileButtonStyle = "w-full px-4 py-4 rounded-lg"

  onMount(async () => {
    const [equitiesResponse, transactionsResopnse] = await Promise.all([
      equityList(),
      transactionsList(),
    ])

    equities = equitiesResponse.result
    transactionsHistory = transactionsResopnse.result

    loadNotifications()
  })

  async function loadNotifications() {
    const notifications: Notification[] = await notificationsList()
    for (let notif of notifications) {
      notification({ message: notif.message, duration: 10000 })
    }
  }

  async function handleConfirmShortcutValue() {
    if (costShortcutToApply && costShortcutToApply.value) {
      // 🤔 WHY WE CAN'T USE ``await`` FOR FUNCTION CALLS BELOW?
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

  function decreaseEquity(currencyId: number, amount: number) {
    for (let item of equities!) {
      if (item.currency.id == currencyId) {
        item.amount -= amount
        return
      }
    }
    throw new Error(`can not find currency ${currencyId}`)
  }

  function transactionFromCost(cost: Cost): Transaction {
    return {
      id: cost.id,
      operation: "cost",
      name: cost.name,
      value: cost.value,
      timestamp: cost.timestamp,
      currency: cost.currency.sign,
      user: cost.user,
    }
  }
</script>

{#if !dataLoaded}
  <p>loading data...</p>
{:else}
  {#if isMobile}
    <!-- ───────────────────────────────────────────────────────── -->
    <!-- MOBILE LAYOUT -->
    <!-- ───────────────────────────────────────────────────────── -->
    <div>
      <!-- EQUITY SECTION -->
      <Box
        title="Equity"
        border={3}
        padding="default"
        actionItemIcon="📔"
        actionItemCallback={() => {
          goto("/transactions")
        }}
      >
        <div class="flex flex-col items-center gap-2">
          {#each equities! as item}
            <a
              href={`/transactions?currencyId=${item.currency.id}`}
              class="cursor-pointer hover:text-emerald-500"
              >{persistent.identity!.user.configuration.showEquity
                ? `${prettyMoney(item.amount)} ${item.currency.sign}`
                : `***** ${item.currency.sign}`}</a
            >
          {/each}
        </div>
      </Box>

      <br />

      <!-- ACTIONS SECTION -->
      <Box title="Actions" border={2}>
        <div class="flex flex-col gap-3">
          <Button
            styles={`${mobileButtonStyle} ${STYLES.bgColor.blue}`}
            title="Exchange"
            onclick={() => {
              goto("/transactions/exchange")
            }}
          />
          <Button
            styles={`${mobileButtonStyle} ${STYLES.bgColor.green}`}
            title="Income"
            onclick={() => {
              goto("/transactions/incomes")
            }}
          />
          <Button
            styles={`${mobileButtonStyle} ${STYLES.bgColor.red}`}
            title="Cost"
            onclick={() => {
              goto("/transactions/costs")
            }}
          />
        </div>
      </Box>
    </div>
  {:else}
    <!-- ───────────────────────────────────────────────────────── -->
    <!-- DESKTOP LAYOUT -->
    <!-- ───────────────────────────────────────────────────────── -->
    <main class="flex gap-7">
      <div class="flex flex-col gap-7 min-w-48 max-w-56">
        <!-- ───────────────────────────────────────────────────────── -->
        <!-- EQUITY SECTION -->
        <!-- ───────────────────────────────────────────────────────── -->
        <Box title="Equity">
          <div class="flex flex-col items-center gap-2">
            {#each equities! as item}
              <a
                href={`/transactions?currencyId=${item.currency.id}`}
                class="cursor-pointer hover:text-emerald-500"
                >{persistent.identity!.user.configuration.showEquity
                  ? `${prettyMoney(item.amount)} ${item.currency.sign}`
                  : `***** ${item.currency.sign}`}</a
              >
            {/each}
          </div>
        </Box>

        <!-- ───────────────────────────────────────────────────────── -->
        <!-- ACTIONS SECTION -->
        <!-- ───────────────────────────────────────────────────────── -->
        <Box title="Actions">
          <div class="flex flex-col gap-5">
            <Button
              color="blue"
              title="Exchange"
              onclick={() => {
                goto("/transactions/exchange")
              }}
            />
            <Button
              color="green"
              title="Income"
              onclick={() => {
                goto("/transactions/incomes")
              }}
            />
            <Button
              color="red"
              title="Cost"
              onclick={() => {
                goto("/transactions/costs")
              }}
            />
          </div>
        </Box>
      </div>

      <!-- SHORTCUTS SECTION -->
      <div class="w-full">
        <Box title="Shortcuts">
          <div class="flex flex-wrap gap-3 justify-center">
            {#each persistent.costShortcuts! as shortcut}
              <CostShortcutComponent
                onclick={async () => {
                  if (!shortcut.value) {
                    costShortcutToApply = { ...shortcut }
                  } else {
                    const response: Response<Cost> = await costShortcutApply(
                      shortcut.id
                    )
                    notification({
                      message: `saved, ${shortcut.name} ${shortcut.value}${shortcut.currency.sign}`,
                    })
                    decreaseEquity(shortcut.currency.id, shortcut.value)
                    transactionsHistory!.push(
                      transactionFromCost(response.result)
                    )
                  }
                }}
              >
                <!-- Delete Button -->
                <button
                  type="button"
                  class="text-[#3a342e] hover:text-white self-start ml-3 mt-2 hover:cursor-pointer"
                  style="font-size: 0.8rem;"
                  onclick={async (e) => {
                    e.stopPropagation()

                    // note: 🤔 why we can't use the `await` expression here?
                    costShortcutDelete(shortcut.id)
                    persistent.costShortcuts = persistent.costShortcuts!.filter(
                      (item) => item.id != shortcut.id
                    )
                    persistent.flush()
                    notification({
                      message: `delete ${shortcut.name} ${shortcut.value ?? "__"}${shortcut.currency.sign}`,
                      icon: "🗑️",
                    })
                  }}
                  aria-label="Delete shortcut">X</button
                >
                <!-- Text -->
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
              class="border-2 p-2 w-32 rounded-md italic text-xl hover:bg-emerald-800 cursor-pointer"
              onclick={() => {
                goto("/transactions/costs/shortcuts/create")
              }}>➕</button
            >
          </div>
        </Box>
      </div>

      <!-- HISTORY SECTION -->
      <div class="min-w-120 max-w-140 flex">
        <Box
          title="History"
          actionItemIcon="📔"
          actionItemCallback={() => {
            goto("/transactions")
          }}
        >
          <div class="flex flex-col gap-2 text-sm text-gray-300">
            {#each Object.entries(groupedHistoryItems) as aggregatedItem}
              <div
                class="py-1 font-semibold text-gray-400 border-b border-gray-600"
              >
                {aggregatedItem[0]}
              </div>
              {#each aggregatedItem[1] as transaction}
                <a
                  href={retrieveUrlFromTransaction(transaction)}
                  class="hover:text-gray-100 flex justify-between"
                >
                  <div class="flex justify-between w-full gap-5">
                    <p class="grow">
                      {`${TRANSACTION_OPERATIONS_MAPPER[transaction.operation]} ${transaction.icon} ${transaction.name}`}
                    </p>
                    <p>
                      {prettyMoney(transaction.value)}{transaction.currency}
                    </p>
                    <p class="text-gray-500">{transaction.user}</p>
                  </div>
                </a>
              {/each}
              <div class="mt-3"></div>
            {/each}
          </div>
        </Box>
      </div>
    </main>
  {/if}

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
          type="number"
          bind:value={costShortcutToApply.value}
          class="border rounded-md w-full h-12 p-3 hover:border-amber-300"
          autofocus
          onkeydown={(e) => {
            if (e.key === "Enter") handleConfirmShortcutValue()
          }}
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
