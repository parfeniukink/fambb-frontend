function validateMoney(data: any): number {
	try {
		return parseFloat(String(data).trim().replace(',', '.'));
	} catch (e) {
		console.error("can't parse money: ", data);
		throw Error(String(e));
	}
}

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

/* User & Configuration */
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

// TRANSACTIONS
export interface Transaction {
	id: number;
	operation: string;
	name: string;
	value: number;
	timestamp: string;
	currency: string;
	user: string;
}

// COSTS
export interface Cost {
	id: number;
	name: string;
	value: number;
	timestamp: string;
	user: string;
	currency: Currency;
	category: CostCategory;
}

export interface CostCreateRequestBody {
	name: string;
	value: number;
	timestamp: string;
	currencyId: number;
	categoryId: number;
}

export interface CostUpdateRequestBody {
	name?: string;
	value?: number;
	timestamp?: string;
	currencyId?: number;
	categoryId?: number;
}

export interface CostShortcut {
	id: number;
	name: string;
	value: number;
	currency: Currency;
	category: CostCategory;
}

export interface CostShortcutCreateRequestBody {
	name: string;
	value: string | number | null;
	currencyId: number;
	categoryId: number;
}

// INCOMES
export interface Income {
	id: number;
	name: string;
	value: number;
	source: string;
	timestamp: string;
	user: string;
	currency: Currency;
}

export interface IncomePayloadRequestBody {
	name: string;
	value: string | number | null;
	source: string;
	timestamp: string;
	currencyId: number | null;
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

export class ExchangePayloadRequestBody {
	fromValue: string | number | null = null;
	toValue: string | number | null = null;
	timestamp: string = new Date().toISOString().slice(0, 10);
	fromCurrencyId: number | null = null;
	toCurrencyId: number | null = null;

	// defines if the data is ready to be sent
	public readyToGo() {
		this.fromValue = validateMoney(this.fromValue);
		this.toValue = validateMoney(this.toValue);

		if (
			this.fromValue &&
			this.toValue &&
			this.timestamp &&
			this.fromCurrencyId &&
			this.toCurrencyId
		) {
			if (this.fromCurrencyId === this.toCurrencyId) {
				throw new Error('same currencies');
			}
			if (this.fromValue === this.toValue) {
				throw new Error('same values');
			}
		} else {
			throw new Error('complete input');
		}
	}
}

// COST DETAILED ANALYTICS
export interface CostByCategory {
	name: string;
	total: number;
	ratio: number;
}
export interface CostsAnalytics {
	total: number;
	categories: CostByCategory[];
}

// INCOME DETAILED ANALYTICS
export interface IncomeBySource {
	source: string;
	total: number;
}

export interface IncomesAnalytics {
	total: number;
	sources: IncomeBySource[];
}

// TRANSACTIONS DETAILED ANALYTICS
export interface TransactionBasicAnalytics {
	currency: Currency;
	costs: CostsAnalytics;
	incomes: IncomesAnalytics;
	fromExchanges: number;
	totalRatio: number;
}

export interface FiltersStore {
	startDate: string | null;
	endDate: string;
	pattern: string | null;
}

export interface UserSettingsUpdatePartialRequestBody {
	showEquity?: boolean;
	defaultCurrencyId?: number | null;
	defaultCostCategoryId?: number | null;
	costSnippets?: string[];
	incomeSnippets?: string[];
	notifyCostThreshold?: number | null;
}

export interface Notification {
	message: string;
	level: string;
}
