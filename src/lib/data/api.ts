import type {
  CostCategory,
  CostCreateRequestBody,
  CostShortcutCreateRequestBody,
  Currency,
} from "$lib/types/money"

// ─────────────────────────────────────────────────────────
// transactions related
// ─────────────────────────────────────────────────────────

// costs related
export const CURRENCIES: Currency[] = [
  {
    id: 1,
    name: "USD",
    sign: "$",
  },
  {
    id: 2,
    name: "UAH",
    sign: "₴",
  },
]

// costs related
export const COST_CATEGORIES: CostCategory[] = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Utilities" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Health" },
]
export const COST_SNIPPETS: string[] = ["Water", "Welmart", "Pizza", "Other"]

export async function costCreate(requestBody: CostCreateRequestBody) {
  console.log("Creating Cost with ", requestBody)
}

export async function costShortcutCreate(
  requestBody: CostShortcutCreateRequestBody
) {
  console.log("Creating Cost Shortcut with ", requestBody)
}

// incomes related
export const INCOME_SNIPPETS: string[] = ["Office", "Crypto", "Other"]

export async function incomeCreate(requestBody: IncomeCreateRequestBody) {
  console.log("Creating Income with ", requestBody)
}

export async function exchangeCreate(requestBody: ExchangeCreateRequestBody) {
  console.log("Creating Exchange with ", requestBody)
}
