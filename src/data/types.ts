export interface Response<T> {
  result: T;
}
export interface Response<T> {
  result: T;
}

export interface ResponseMulti<T> {
  result: T[];
}

export interface ResponseMultiPaginated<T> {
  result: T[];
  context: number;
  left: number;
}

// backend response data structures
export interface Currency {
  id: number;
  name: string;
  sign: string;
}

export interface Equity {
  currency: Currency;
  amount: number;
}

export interface CostCategory {
  id: number;
  name: string;
}

export interface Configuration {
  defaultCurrency: Currency | null;
  defaultCostCategory: CostCategory | null;
  costSnippets: string[] | null;
  incomeSnippets: string[] | null;
}

export interface User {
  id: number;
  name: string;
  configuration: Configuration;
}

export interface Transaction {
  id: number;
  operation: string;
  name: string;
  value: number;
  timestamp: string;
  currency: string;
}
