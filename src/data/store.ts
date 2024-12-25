import { writable } from "svelte/store";
import { fetchEquity, fetchCostCategories, fetchUser } from "./requests";
import type {
  CostShortcut,
  Equity,
  Transaction,
  CostCategory,
  User,
  PopupConfig,
} from "./types";
import * as localStorageRepository from "./localStorageRepository";

// analytics
export const equityStore = writable<Equity[]>(
  localStorageRepository.getEquity(),
);

equityStore.subscribe(($equityStore) => {
  localStorageRepository.setEquity($equityStore);
});

export const transactionsHistoryStore = writable<Transaction[]>([]);

// cost categories
export const costCategoriesStore = writable<CostCategory[]>(
  localStorageRepository.getCostCategories(),
);

// user along with configuration
export const userStore = writable<User | null>(
  localStorageRepository.getUser(),
);

export const costShortcutsStore = writable<CostShortcut[]>([]);

// popup store

const createPoputStore = () => {
  const { subscribe, set } = writable<PopupConfig | null>(null);

  function showPopup(message: string) {
    set({ message });

    setTimeout(() => {
      set(null); // Hide the popup after 2 seconds
    }, 2000);
  }

  return {
    subscribe,
    showPopup,
  };
};

export const popupStore = createPoputStore();

// Populate the whole state on the first startup or fallback to localStorage data
export async function initPersistentStore(secret: string) {
  // save the secret first
  localStorageRepository.setSecret(secret);

  const results = await Promise.all([
    fetchUser(),
    fetchEquity(),
    fetchCostCategories(),
  ]);

  // save to the persistent local storage
  localStorageRepository.setUser(results[0]["result"]);
  localStorageRepository.setEquity(results[1]["result"]);
  localStorageRepository.setCostCategories(results[2]["result"]);

  // update Svelte internal store
  userStore.set(results[0]["result"]);
  equityStore.set(results[1]["result"]);
  costCategoriesStore.set(results[2]["result"]);
}
