import type { CostCategory, Equity, User } from "./types";

function localStorageItemSerialized<T>(key: string): T | null {
  const payload: string | null = localStorage.getItem(key);

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
  localStorage.setItem("user", JSON.stringify(data));
};

export const getUser = (): User | null => {
  const data = localStorageItemSerialized("user");
  return data ? (data as User) : null;
};

export const setEquity = (data: Equity[]): void => {
  localStorage.setItem("equity", JSON.stringify({ items: data }));
};

export const getEquity = (): Equity[] => {
  const data = localStorageItemSerialized<{ items: Equity[] }>("equity");
  return data ? (data["items"] as Equity[]) : [];
};

export const setCostCategories = (data: CostCategory[]): void => {
  localStorage.setItem("costCategories", JSON.stringify({ items: data }));
};

export const getCostCategories = (): CostCategory[] => {
  const data = localStorageItemSerialized<{ items: CostCategory[] }>(
    "costCategories",
  );
  return data ? (data["items"] as CostCategory[]) : [];
};

export const setSecret = (data: string): void => {
  localStorage.setItem("secret", data);
};

export const getSecret = (): string | null => {
  return localStorage.getItem("secret");
};
