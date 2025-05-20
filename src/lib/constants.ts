import type { IncomeSource } from "./types/money"

export const INCOME_SOURCES: IncomeSource[] = [
  "revenue",
  "gift",
  "debt",
  "other",
]

export const TRANSACTION_OPERATIONS_MAPPER: Record<string, string> = {
  cost: "-",
  income: "+",
  exchange: "=",
}
