import type { CostCategory, Equity, User } from "./types";

function sessionStorageItemSerialized(key: string): object | null {
  const payload: string | null = sessionStorage.getItem(key);

  if (!payload) {
    return null;
  } else {
    try {
      return JSON.parse(payload);
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
  const data = sessionStorageItemSerialized("equity");
  return data ? (data["items"] as Equity[]) : [];
};

export const setCostCategories = (data: CostCategory[]): void => {
  sessionStorage.setItem("costCategories", JSON.stringify({ items: data }));
};

export const getCostCategories = (): CostCategory[] => {
  const data = sessionStorageItemSerialized("costCategories");
  return data ? (data["items"] as CostCategory[]) : [];
};

export const setSecret = (data: string): void => {
  console.log(`saving secret: ${data}`);
  sessionStorage.setItem("secret", data);
};

export const getSecret = (): string | null => {
  return sessionStorage.getItem("secret");
};
