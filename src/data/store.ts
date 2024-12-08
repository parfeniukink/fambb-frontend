import { writable } from "svelte/store";
import { fetchEquity, fetchCostCategories, fetchUser } from "./requests";
import type { Equity, Transaction, CostCategory, User } from "./types";
import * as sessionStorageRepository from "./sessionStorageRepository";

// analytics
export const equityStore = writable<Equity[]>(
  sessionStorageRepository.getEquity(),
);

equityStore.subscribe(($equityStore) => {
  sessionStorageRepository.setEquity($equityStore);
});

export const lastTransactionsStore = writable<Transaction[]>([]);

// cost categories
export const costCategoriesStore = writable<CostCategory[]>(
  sessionStorageRepository.getCostCategories(),
);

// user along with configuration
export const userStore = writable<User | null>(
  sessionStorageRepository.getUser(),
);

// Populate the whole state on the first startup or fallback to sessionStorage data
export async function initPersistentStore(secret: string) {
  // save the secret first
  sessionStorageRepository.setSecret(secret);

  const results = await Promise.all([
    fetchUser(),
    fetchEquity(),
    fetchCostCategories(),
  ]);

  // save to the persistent session storage
  sessionStorageRepository.setUser(results[0]["result"]);
  sessionStorageRepository.setEquity(results[1]["result"]);
  sessionStorageRepository.setCostCategories(results[2]["result"]);

  // update Svelte internal store
  userStore.set(results[0]["result"]);
  equityStore.set(results[1]["result"]);
  costCategoriesStore.set(results[2]["result"]);
}
