import { writable } from "svelte/store";

import { fetchTransactions, fetchEquity } from "./requests";
import type { Equity, Transaction, CostCategory } from "./types";

export const equityStore = writable<Equity[]>([], () => {
  console.debug("a new equityStore subscriber");
  return () => console.debug("no more equityStore subscibers");
});
export const lastTransactionsStore = writable<Transaction[]>([], () => {
  console.debug("a new lastTransactionStore subscriber");
  return () => console.debug("no more lastTransactionsStore subscribers");
});
export const costCategories = writable<CostCategory[]>([]);

/* Populate the whole state on the first startup */
export async function initStore() {
  const results = await Promise.all([fetchEquity(), fetchTransactions()]);

  equityStore.set(results[0]["result"]);
  lastTransactionsStore.set(results[1]["result"]);
}
