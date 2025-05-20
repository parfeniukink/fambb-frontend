import type { Transaction } from "$lib/types/money"
import { formatDate } from "./datetime"

// convert number into pretty string to represent for user
export function prettyMoney(value: number): string {
  if (!value) throw new Error("no value provided")

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
// todo: group annually if more than 1 year appears
export function groupTransactionsByDate(
  items: Transaction[]
): Record<string, Transaction[]> {
  const grouped = new Map<string, Transaction[]>()

  for (const item of items) {
    const dateKey = formatDate(item.timestamp)
    if (!grouped.has(dateKey)) grouped.set(dateKey, [])
    grouped.get(dateKey)!.push(item)
  }

  return Object.fromEntries(
    Array.from(grouped.entries()).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    )
  )
}

// returns the DETAIL URL, based on the TRANSACTION
export function retrieveUrlFromTransaction(transaction: Transaction): string {
  switch (transaction.operation) {
    case "cost":
      return `/transactions/costs/${transaction.id}`
    case "income":
      return `/transactions/incomes/${transaction.id}`
    case "exchange":
      return `/transactions/exchange/${transaction.id}`
    default:
      throw new Error(`Can't get URL from ${transaction}`)
  }
}
