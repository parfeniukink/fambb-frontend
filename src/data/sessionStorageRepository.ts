// NOTE: improvement for the sessionStorage
// function sessionStorageItemSerialized(key: string) {
//   if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
//     return sessionStorage.getItem(key);
//   }
//   return null; // or a default value
// }
//
import type { CostCategory, CostShortcut, Equity, User } from "./types";

function sessionStorageItemSerialized<T>(key: string): T | null {
  const payload: string | null = sessionStorage.getItem(key);

  if (!payload) {
    return null;
  } else {
    try {
      return JSON.parse(payload) as T;
    } catch (e) {
      console.error(`Can't parse ${payload}. Error: ${e}`);
      return null;
    }
  }
}

export const setUser = (data: User): void => {
  sessionStorage.setItem("user", JSON.stringify(data));
};

export const getUser = (): User | null => {
  const data = sessionStorageItemSerialized("user");
  return data ? (data as User) : null;
};

export const setEquity = (data: Equity[]): void => {
  sessionStorage.setItem("equity", JSON.stringify({ items: data }));
};

export const getEquity = (): Equity[] => {
  const data = sessionStorageItemSerialized<{ items: Equity[] }>("equity");
  return data ? (data["items"] as Equity[]) : [];
};

export const setCostCategories = (data: CostCategory[]): void => {
  sessionStorage.setItem("costCategories", JSON.stringify({ items: data }));
};

export const getCostCategories = (): CostCategory[] => {
  const data = sessionStorageItemSerialized<{ items: CostCategory[] }>(
    "costCategories",
  );
  return data ? (data["items"] as CostCategory[]) : [];
};

export const setSecret = (data: string): void => {
  sessionStorage.setItem("secret", data);
};

export const getSecret = (): string | null => {
  return sessionStorage.getItem("secret");
};
