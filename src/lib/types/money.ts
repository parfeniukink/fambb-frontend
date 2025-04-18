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

// COST-specific types
export type CostCategory = {
  id: number
  name: string
}

export type CostShortcut = {
  id: number
  name: string
  value: number | null
  currency: Currency
  category: CostCategory
}

// INCOME-specific types
// CURRENCY EXCHANGE-specific types
