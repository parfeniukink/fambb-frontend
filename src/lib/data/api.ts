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
  Equity,
} from "$lib/types/money"
import type { User, Identity, UserLoginRequestBody } from "$lib/types/identity"
import type {
  PaginatedResponse,
  Response,
  ResponseMulti,
} from "$lib/types/response"

// ─────────────────────────────────────────────────────────
// user related
// ─────────────────────────────────────────────────────────
export async function userLogin(
  request: UserLoginRequestBody
): Promise<Response<Identity>> {
  return {
    result: {
      accessToken: "d1c80f2f-a4ad-4e31-a0d6-8c1c94c85d31",
      user: {
        id: 1,
        name: request.username,
        configuration: {
          showEquity: true,
          defaultCurrency: { id: 1, name: "USD", sign: "$" },
          defaultCostCategory: { id: 1, name: "Food" },
          costSnippets: ["Water", "Pizza"],
          incomeSnippets: ["Office"],
          notifyCostThreshold: 100,
        },
      },
    },
  }

  throw Error("authorization failed")
}

// ─────────────────────────────────────────────────────────
// transactions related
// ─────────────────────────────────────────────────────────
export async function transactionsList(
  context = 0,
  limit = 10,
  currencyId: number | null = null
): Promise<PaginatedResponse<Transaction>> {
  const items: Transaction[] = [
    {
      id: 1,
      operation: "cost",
      name: "Water",
      value: 10,
      timestamp: "2020-01-01",
      currency: "$",
      user: "john",
    },
    {
      id: 2,
      operation: "income",
      name: "Office",
      value: 200,
      timestamp: "2020-01-01",
      currency: "$",
      user: "marry",
    },
    {
      id: 3,
      operation: "exchange",
      name: "Currency exchange",
      value: 100,
      timestamp: "2020-01-01",
      currency: "$",
      user: "john",
    },
  ]
  const newContext = context + items.length
  const left = 150
  return {
    context: newContext,
    left: left,
    result: items,
  }
}

const currencyUSD: Currency = { id: 1, name: "USD", sign: "$" }
const currencyUAH: Currency = { id: 2, name: "UAH", sign: "#" }
const categoryFood: CostCategory = { id: 1, name: "Food" }

// costs related
export async function costCategoriesList(): Promise<
  ResponseMulti<CostCategory>
> {
  return {
    result: [
      { id: 1, name: "Food" },
      { id: 2, name: "Transport" },
      { id: 3, name: "Utilities" },
      { id: 4, name: "Entertainment" },
      { id: 5, name: "Health" },
    ],
  }
}

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

export async function costUpdate(costId: number, payload: Record<string, any>) {
  console.log(`Updated Cost ${costId} with ${payload}`)
}

export async function costDelete(costId: number): Promise<void> {
  console.log(`Delete Cost ${costId}`)
  // todo: send the API call
}

// Cost Shortcuts
export async function costShortcutCreate(
  requestBody: CostShortcutCreateRequestBody
): Promise<Response<CostShortcut>> {
  return {
    result: {
      id: 456,
      name: requestBody.name,
      value: requestBody.value,
      currency: currencyUSD,
      category: categoryFood,
    },
  }
}

export async function costShortcutsList(): Promise<
  ResponseMulti<CostShortcut>
> {
  return {
    result: [
      {
        id: 1,
        name: "Coffee",
        value: 3,
        currency: currencyUSD,
        category: categoryFood,
      },
      {
        id: 2,
        name: "Bus Ticket",
        value: 2,
        currency: currencyUSD,
        category: { id: 2, name: "Transport" },
      },
      {
        id: 3,
        name: "Lunch",
        value: 12,
        currency: currencyUSD,
        category: categoryFood,
      },
    ],
  }
}

export async function costShortcutDelete(costShortcutId: number) {
  console.log(`Delete Cost Shortcut ${costShortcutId}`)
}

// Incomes
export async function incomeCreate(
  requestBody: IncomeCreateRequestBody
): Promise<Income> {
  return {
    id: 789,
    name: requestBody.name,
    value: requestBody.value,
    source: requestBody.source,
    currency: currencyUSD,
    timestamp: requestBody.timestamp,
  }
}

export async function incomeRetrieve(incomeId: number): Promise<Income> {
  return {
    id: incomeId,
    name: "Retrieved Income Item",
    value: 100,
    timestamp: "2020-01-01",
    currency: currencyUSD,
    source: "revenue",
  }
}

export async function incomeUpdate(
  incomeId: number,
  payload: Record<string, any>
) {
  console.log(`Updated Income ${incomeId} with ${payload}`)
}

export async function incomeDelete(incomeId: number) {
  console.log(`Delete Income ${incomeId}`)
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
    timestamp: "2020-01-01",
  }
}

export async function exchangeRetrieve(exchangeId: number): Promise<Exchange> {
  return {
    id: exchangeId,
    fromValue: 100,
    toValue: 25,
    fromCurrency: currencyUSD,
    toCurrency: currencyUAH,
    timestamp: "2020-01-01",
  }
}

export async function exchangeDelete(exchangeId: number): Promise<void> {
  // todo: send the API call
  console.log(`Delete Exchange ${exchangeId}`)
}

// ─────────────────────────────────────────────────────────
// analytics related
// ─────────────────────────────────────────────────────────
export async function equityList(): Promise<ResponseMulti<Equity>> {
  return {
    result: [
      { currency: { id: 1, name: "USD", sign: "$" }, equity: 1500 },
      { currency: { id: 2, name: "UAH", sign: "₴" }, equity: 42000 },
    ],
  }
}
