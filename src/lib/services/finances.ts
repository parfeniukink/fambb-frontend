import type { Transaction } from "$lib/types/money"
import { formatDate } from "./datetime"

// convert number into pretty string to represent for user
export function prettyMoney(value: number) {
  let formatted = value.toFixed(2)
  let [integerPart, decimalPart] = formatted.split(".")

  let formattedIntegetr = ""
  for (let i = 0; i < integerPart.length; i++) {
    if (i > 0 && (integerPart.length - i) % 3 === 0) {
      formattedIntegetr += " "
    }
    formattedIntegetr += integerPart[i]
  }

  return `${formattedIntegetr}.${decimalPart}`
}

// returns groups of transactions, sorted by datetime
export function groupTransactionsByDate(
  items: Transaction[]
): Record<string, Transaction[]> {
  const grouped = items.reduce(
    (acc, item) => {
      const dateKey = formatDate(item.timestamp)
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(item)
      return acc
    },
    {} as Record<string, Transaction[]>
  )

  const sortedKeys = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  const sortedGrouped: Record<string, Transaction[]> = {}
  for (const key of sortedKeys) {
    sortedGrouped[key] = grouped[key]
  }

  return sortedGrouped
}
