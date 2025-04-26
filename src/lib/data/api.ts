import type {
  CostCategory,
  CostCreateRequestBody,
  CostShortcutCreateRequestBody,
  Currency,
  Cost,
  Transaction,
  CostShortcut,
  IncomeCreateRequestBody,
  Income,
  ExchangeCreateRequestBody,
  Exchange,
} from "$lib/types/money"

// ─────────────────────────────────────────────────────────
// transactions related
// ─────────────────────────────────────────────────────────
export async function transactionsList(): Promise<Transaction[]> {
  // TODO: Replace with real API call
  return [
    {
      id: 1,
      operation: "cost",
      name: "Water",
      value: 10,
      currency: "$",
      user: "john",
    },
    {
      id: 2,
      operation: "income",
      name: "Office",
      value: 200,
      currency: "$",
      user: "marry",
    },
    {
      id: 3,
      operation: "exchange",
      name: "Currency exchange",
      value: 100,
      currency: "$",
      user: "john",
    },
  ]
}

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

const currencyUSD: Currency = { id: 1, name: "USD", sign: "$" }
const categoryFood: CostCategory = { id: 1, name: "Food" }

// costs related
export const COST_CATEGORIES: CostCategory[] = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Utilities" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Health" },
]
export const COST_SNIPPETS: string[] = ["Water", "Welmart", "Pizza", "Other"]

export async function costCreate(
  requestBody: CostCreateRequestBody
): Promise<Cost> {
  return {
    id: 123,
    name: requestBody.name,
    value: requestBody.value,
    timestamp: "2020-01-01",
    currency: currencyUSD,
    category: categoryFood,
  }
}

export async function costUpdate(costId: number, payload: Record<str, any>) {}

export async function costRetrieve(costId: number): Promise<Cost> {
  return {
    id: costId,
    name: "Retrieved Item",
    value: 100,
    timestamp: "2020-01-01",
    currency: currencyUSD,
    category: categoryFood,
  }
}

export async function costShortcutCreate(
  requestBody: CostShortcutCreateRequestBody
): Promise<CostShortcut> {
  return {
    id: 456,
    name: requestBody.name,
    value: requestBody.value,
    currency: currencyUSD,
    category: categoryFood,
  }
}

// Incomes
export const INCOME_SNIPPETS: string[] = ["Office", "Crypto", "Other"]
export async function incomeCreate(
  requestBody: IncomeCreateRequestBody
): Promise<Income> {
  return {
    id: 789,
    name: requestBody.name,
    value: requestBody.value,
    srouce: requestBody.source, // note: type has typo 'srouce' in original
    currency: currencyUSD,
  }
}

// Currency Exchange
export async function exchangeCreate(
  requestBody: ExchangeCreateRequestBody
): Promise<Exchange> {
  return {
    id: 1011,
    fromValue: requestBody.fromValue,
    toValue: requestBody.toValue,
    fromCurrency: currencyUSD,
    toCurrency: { id: 2, name: "UAH", sign: "₴" },
  }
}
