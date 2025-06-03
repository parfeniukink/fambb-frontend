import type { Currency } from "./money"

export type CostsByCategory = {
  id: number
  name: string
  total: number // total money spent for the category
  ratio: number // ``category total / all categories total``
}

export type CostsBasicAnalytics = {
  total: number
  categories: CostsByCategory[]
}

export type IncomesBySource = {
  total: number
  source: string
}

export type IncomesBasicAnalytics = {
  total: number
  sources: IncomesBySource[]
}

export type TransactionsBasicAnalytics = {
  currency: Currency
  costs: CostsBasicAnalytics
  incomes: IncomesBasicAnalytics
  fromExchanges: number // how much came from currency exchange
  totalRatio: number // all costs / all incomes
}

export type AnalyticsFiltersQueryParams = {
  startDate: string | null
  endDate: string
  pattern: string | null
}

export type AnalyticsPeriod = "current-month" | "previous-month" | string
