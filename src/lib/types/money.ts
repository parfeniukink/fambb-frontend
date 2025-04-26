// general types
export type Currency = {
  id: number
  name: string
  sign: string
}

export type Equity = {
  currency: Currency
  equity: number
}

export type Transaction = {
  id: number
  operation: string
  name: string
  value: number
  // timestamp: string
  currency: string
  user: string
}

// COST-related
export type CostCategory = {
  id: number
  name: string
}

export type CostCreateRequestBody = {
  name: string
  value: number
  timestamp: string
  currencyId: number
  categoryId: number
}

export type Cost = {
  id: number
  name: string
  value: number | null
  currency: Currency
  category: CostCategory
}

export type CostShortcutCreateRequestBody = {
  name: string
  value: number
  currencyId: number
  categoryId: number
}

export type CostShortcut = {
  id: number
  name: string
  value: number | null
  currency: Currency
  category: CostCategory
}

// INCOME-related
export type IncomeSource = "revenue" | "gift" | "debt" | "other"

export type IncomeCreateRequestBody = {
  name: string
  value: number
  source: IncomeSource
  timestamp: string
  currencyId: number
}

export type Income = {
  id: number
  name: string
  value: number
  srouce: IncomeSource
  currency: Currency
}

// EXCHANGE-related
export type IncomeCreateRequestBody = {
  name: string
  value: number
  source: IncomeSource
  timestamp: string
  currencyId: number
}

export type Income = {
  id: number
  name: string
  value: number
  srouce: IncomeSource
  currency: Currency
}

// CURRENCY EXCHANGE-specific types
export type ExchangeCreateRequestBody = {
  fromValue: number
  toValue: number
  fromCurrencyId: number
  toCurrencyId: number
  timestamp: string
}

export type Exchange = {
  id: number
  fromValue: number
  toValue: number
  fromCurrency: Currency
  toCurrency: Currency
}

// INFRASTRUCTURE
export type SelectionItem = {
  value: number | string
  content: string
}
