/* Generics */
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

/* Response definitions */
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
  user: string;
}

export interface Cost {
  id: number;
  name: string;
  value: number;
  timestamp: string;
  user: string;
  currency: Currency;
  category: CostCategory;
}

export interface Income {
  id: number;
  name: string;
  value: number;
  source: string;
  timestamp: string;
  user: string;
  currency: Currency;
}

export interface Exchange {
  id: number;
  fromValue: number;
  toValue: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  timestamp: string;
  user: string;
}

/* Request Body definitions */
export class CostPayloadRequestBody {
  name: string | null = null;
  value: number | null = null;
  timestamp: string = new Date().toISOString().slice(0, 10);
  currencyId: number | null = null;
  categoryId: number | null = null;

  constructor(configuration: Configuration | null = null) {
    if (configuration != null) {
      this.currencyId = configuration.defaultCurrency
        ? configuration.defaultCurrency.id
        : null;
      this.categoryId = configuration.defaultCostCategory
        ? configuration.defaultCostCategory.id
        : null;
    }
  }

  // defines if the data is ready to be sent
  public readyToGo() {
    if (
      this.name &&
      this.value &&
      this.timestamp &&
      this.currencyId &&
      this.categoryId
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export class ExchangePayloadRequestBody {
  fromValue: number | null = null;
  toValue: number | null = null;
  timestamp: string = new Date().toISOString().slice(0, 10);
  fromCurrencyId: number | null = null;
  toCurrencyId: number | null = null;

  // defines if the data is ready to be sent
  public readyToGo() {
    if (
      this.fromValue &&
      this.toValue &&
      this.timestamp &&
      this.fromCurrencyId &&
      this.toCurrencyId
    ) {
      if (this.fromCurrencyId === this.toCurrencyId) {
        throw new Error("same currencies");
      }
      if (this.fromValue === this.toValue) {
        throw new Error("same values");
      }
    } else {
      throw new Error("complete input");
    }
  }
}

export class IncomeCreateRequestBody {
  name: string | null = null;
  value: number | null = null;
  source: string = "revenue";
  timestamp: string = new Date().toISOString().slice(0, 10);
  currencyId: number | null = null;

  constructor(configuration: Configuration) {
    this.currencyId = configuration.defaultCurrency
      ? configuration.defaultCurrency.id
      : null;
  }

  // defines if the data is ready to be sent
  public readyToGo() {
    if (
      this.name &&
      this.value &&
      this.source &&
      this.timestamp &&
      this.currencyId
    ) {
      return true;
    } else return false;
  }
}
