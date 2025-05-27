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

export const STYLES: Record<string, Record<string, string>> = {
  width: {
    0: "w-full",
    24: "w-24",
    56: "w-56",
    64: "w-64",
    76: "w-76",
    100: "w-100",
    120: "w-120",
    180: "w-180",
    240: "w-240",
  },
}
