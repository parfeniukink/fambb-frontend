export type Currency = {
  id: number
  name: string
  sign: string
}

export type Equity = {
  currency: Currency
  amount: number
}

export type OperationType = "cost" | "income" | "exchange"

export type Transaction = {
  id: number
  operation: OperationType
  name: string
  icon: string
  value: number
  timestamp: string
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

export type CostPartialUpdateRequestBody = {
  name?: string
  value?: number
  timestamp?: string
  currencyId?: number
  categoryId?: number
}

export type Cost = {
  id: number
  name: string
  value: number
  timestamp: string
  currency: Currency
  category: CostCategory
  user: string
}

export type CostShortcutCreateRequestBody = {
  name: string
  value: number | null
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

export type CostShortcutApplyRequestBody = {
  value: number | null
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

export type IncomePartialUpdateRequestBody = {
  name?: string
  value?: number
  source?: IncomeSource
  timestamp?: string
  currencyId?: number
}

export type Income = {
  id: number
  name: string
  value: number
  source: IncomeSource
  timestamp: string
  currency: Currency
  user: string
}

// CURRENCY EXCHANGE-related types
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
  timestamp: string
  user: string
}

// INFRASTRUCTURE
// todo: move out from here
export type SelectionItem = {
  value: number | string
  content: string
}
