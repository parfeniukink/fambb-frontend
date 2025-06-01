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
    32: "w-32",
    56: "w-56",
    64: "w-64",
    76: "w-76",
    100: "w-100",
    120: "w-120",
    140: "w-140",
    180: "w-180",
    240: "w-240",
  },
  border: {
    1: "border-1",
    2: "border-2",
    3: "border-3",
    4: "border-4",
  },
  padding: {
    default: "p-8",
    small: "p-4",
    lg: "px-32 py-24",
  },
  bgColor: {
    red: "bg-orange-800",
    green: "bg-emerald-800",
    blue: "bg-sky-800",
  },
  textColor: {
    red: "text-[#d68f97]",
    green: "text-[#caf492]",
    blue: "text-[#9bdce8]",
  },
}
