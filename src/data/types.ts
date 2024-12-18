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

/* Request Body definitions
 * probably this code is a piece of shit. you have to separate
 * UI state from the request body data structure and make required fields not optional.
 * this fact is ignored for the MVP phase.
 * */
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

export class IncomePayloadRequestBody {
  name: string | null = null;
  value: number | null = null;
  source: string = "revenue";
  timestamp: string = new Date().toISOString().slice(0, 10);
  currencyId: number | null = null;

  constructor(configuration: Configuration | null = null) {
    if (configuration != null) {
      this.currencyId = configuration.defaultCurrency
        ? configuration.defaultCurrency.id
        : null;
    }
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

// analytics
export class CostByCategory {
  name: string;
  total: number;
  ratio: number;

  constructor(name: string, total: number, ratio: number) {
    this.name = name;
    this.total = total;
    this.ratio = ratio;
  }
}
export class CostsAnalytics {
  total: number;
  categories: CostByCategory[];

  constructor(total: number, categories: CostByCategory[]) {
    this.total = total;
    this.categories = categories;
  }
}

export class IncomeBySource {
  source: string;
  total: number;

  constructor(source: string, total: number) {
    this.source = source;
    this.total = total;
  }
}

export class IncomesAnalytics {
  total: number;
  sources: IncomeBySource[];

  constructor(total: number, sources: IncomeBySource[]) {
    this.total = total;
    this.sources = sources;
  }
}

export class TransactionBasicAnalytics {
  currency: Currency;
  costs: CostsAnalytics;
  incomes: IncomesAnalytics;
  fromExchanges: number;
  totalRatio: number;

  constructor(
    currency: Currency,
    costs: CostsAnalytics,
    incomes: IncomesAnalytics,
    fromExchanges: number,
    totalRatio: number,
  ) {
    this.currency = currency;
    this.costs = costs;
    this.incomes = incomes;
    this.fromExchanges = fromExchanges;
    this.totalRatio = totalRatio;
  }
}

export class CustomDatesRange {
  startDate: string | null = null;
  endDate: string = new Date().toISOString().slice(0, 10);

  public validate() {
    if (!this.startDate) {
      throw Error("start date not specified");
    } else if (this.startDate >= this.endDate) {
      throw Error("start date > end date");
    }
  }
}

export class CostShortcut {
  id: number;
  name: string;
  value: number;
  currency: Currency;
  category: CostCategory;

  constructor(
    id: number,
    name: string,
    value: number,
    currency: Currency,
    costCategory: CostCategory,
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.currency = currency;
    this.category = costCategory;
  }
}

export class CostShortcutCreateRequestBody {
  name: string | null = null;
  value: number | null = null;
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

  public readyToGo() {
    if (!this.name || !this.categoryId || !this.currencyId) {
      throw new Error("complete input");
    }
  }
}

export type PopupConfig = {
  message: string;
};
