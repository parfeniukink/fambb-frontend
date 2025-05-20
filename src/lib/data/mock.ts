import type { Identity } from "$lib/types/identity"
import type { CostCategory, Transaction } from "$lib/types/money"

export const IDENTITY: Identity = {
  accessToken: "d1c80f2f-a4ad-4e31-a0d6-8c1c94c85d31",
  user: {
    id: 1,
    name: "john",
    configuration: {
      showEquity: true,
      defaultCurrency: { id: 1, name: "USD", sign: "$" },
      defaultCostCategory: { id: 1, name: "Food" },
      costSnippets: ["Water", "Pizza"],
      incomeSnippets: ["Office"],
      notifyCostThreshold: 100,
    },
  },
}

export const COST_CATEGORIES: CostCategory[] = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Utilities" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Health" },
]

export const TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    operation: "cost",
    name: "Water",
    value: 10,
    timestamp: "2020-01-01",
    currency: "$",
    user: "john",
  },
  {
    id: 2,
    operation: "income",
    name: "Office",
    value: 200,
    timestamp: "2020-01-01",
    currency: "$",
    user: "marry",
  },
  {
    id: 3,
    operation: "exchange",
    name: "Currency exchange",
    value: 100,
    timestamp: "2020-01-03",
    currency: "$",
    user: "john",
  },
  {
    id: 4,
    operation: "cost",
    name: "Coffee",
    value: 5,
    timestamp: "2020-01-03",
    currency: "$",
    user: "john",
  },
  {
    id: 5,
    operation: "cost",
    name: "Lunch",
    value: 15,
    timestamp: "2020-01-05",
    currency: "$",
    user: "marry",
  },
  {
    id: 6,
    operation: "income",
    name: "Bonus",
    value: 300,
    timestamp: "2020-01-06",
    currency: "$",
    user: "john",
  },
  {
    id: 7,
    operation: "exchange",
    name: "Exchange",
    value: 50,
    timestamp: "2020-01-07",
    currency: "$",
    user: "marry",
  },
  {
    id: 8,
    operation: "cost",
    name: "Snacks",
    value: 6,
    timestamp: "2020-01-08",
    currency: "$",
    user: "john",
  },
  {
    id: 9,
    operation: "cost",
    name: "Taxi",
    value: 20,
    timestamp: "2020-01-09",
    currency: "$",
    user: "marry",
  },
  {
    id: 10,
    operation: "income",
    name: "Freelance",
    value: 400,
    timestamp: "2020-01-10",
    currency: "$",
    user: "john",
  },
]
