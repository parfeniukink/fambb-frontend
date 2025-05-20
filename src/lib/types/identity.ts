import type { Currency, CostCategory } from "./money"

export type Configuration = {
  showEquity: boolean
  defaultCurrency: Currency | null
  defaultCostCategory: CostCategory | null
  costSnippets: string[]
  incomeSnippets: string[]
  notifyCostThreshold: number | null
}

export type User = {
  id: number
  name: string
  configuration: Configuration
}

export type UserAuthRequestBody = {
  token: string
}

export type Identity = {
  accessToken: string
  user: User
}
