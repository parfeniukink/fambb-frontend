import { writable } from "svelte/store";

import {
  fetchTransactions,
  fetchEquity,
  fetchCostCategories,
  fetchUser,
} from "./requests";
import type { Equity, Transaction, CostCategory, User } from "./types";

// analytics
export const equityStore = writable<Equity[]>([]);
export const lastTransactionsStore = writable<Transaction[]>([]);

// cost categories
export const costCategoriesStore = writable<CostCategory[]>([]);

// user along with configuration
export const userStore = writable<User | null>(null);

/* Populate the whole state on the first startup */
export async function initStore() {
  const results = await Promise.all([
    fetchUser(),
    fetchEquity(),
    fetchTransactions(),
    fetchCostCategories(),
  ]);

  userStore.set(results[0]["result"]);
  equityStore.set(results[1]["result"]);
  lastTransactionsStore.set(results[2]["result"]);
  costCategoriesStore.set(results[3]["result"]);
}
