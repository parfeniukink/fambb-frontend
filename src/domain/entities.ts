// this module includes internal data structures which are a part of a business
// concept that is reflected on UI.
// in this application the idea of ``User`` that comes from the API (backend)
// is separated from the idea of ``User`` on the UI side even if data structure
// fields are the same.
//
// WHY IS THAT?
// because we use DDD and we separate the concept
// of the Presentation Layer from the concept of a Domain Layer.

// AUTHENTICASTION
export interface Auth {
	token: string;
	authenticated: boolean;
}

// ANALYTICS

export interface Currency {
	id: number;
	name: string;
	sign: string;
}

export interface Equity {
	currency: Currency;
	amount: number;
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
export interface TransactionBasicAnalytics {
	currency: Currency;
	costs: CostsAnalytics;
	incomes: IncomesAnalytics;
	fromExchanges: number;
	totalRatio: number;
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

export interface CostCategory {
	id: number;
	name: string;
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
export interface CostShortcut {
	id: number;
	name: string;
	value: number;
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

// USER SECTION
export interface Configuration {
	showEquity: boolean;
	defaultCurrency: Currency | null;
	defaultCostCategory: CostCategory | null;
	costSnippets: string[];
	incomeSnippets: string[];
	notifyCostThreshold: number | null;
}

export interface User {
	id: number;
	name: string;
	configuration: Configuration;
}

// USER NOTIFICATIONS
export interface Notification {
	level: string;
	message: string;
}
