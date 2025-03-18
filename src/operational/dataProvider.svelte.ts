// most of the data is stored in the browser's Local Storage.
// this provider allows to provide the data in internal representation,
/*
 * using the `Domain Layer` for data structures and `Infrastructure Layer`
 * for shared services to manage the Local Storage in browser.
 *
 * NOTES
 * -------------
 * the main purpose of this class is to handle the access to the persistent
 * storage from the highest level of the  application.
 * svelte pages are suppose to be consumers of this class.
 *
 * all the persistent items are 'reactive'.
 */

import * as domain from 'src/domain/entities';
import * as localStorageFacade from 'src/infrastructure/localStorage';
import * as client from 'src/api/client';
import type {
	CostCreateRequestBody,
	FiltersStore,
	CostUpdateRequestBody,
	ResponseMultiPaginated,
	UserSettingsUpdatePartialRequestBody,
	CostShortcut,
	CostShortcutCreateRequestBody
} from 'src/api/types';
import { getContext } from 'svelte';

export class DataProxy {
	authState: domain.Auth | null = $state(localStorageFacade.get<domain.Auth | null>('auth'));
	userState: domain.User | null = $state(localStorageFacade.get<domain.User | null>('user'));
	currenciesState: domain.Currency[] | null = $state(
		localStorageFacade.get<domain.Currency[] | null>('currencies')
	);
	costCategoriesState: domain.CostCategory[] | null = $state(
		localStorageFacade.get<domain.CostCategory[] | null>('costCategories')
	);

	constructor() {
		if (this.authState === null) {
			// note: first data initialization
			this.authState = { token: '', authenticated: false };
		} else {
			if (this.authState.authenticated === false) {
				console.error('User is not authenticated');
			} else {
				// note: in case user is authenticated
				this.loadData();
			}
		}
	}

	async loadData(): Promise<void> {
		const [user, equity, costCategories] = await Promise.all([
			this.fetchUser(),
			this.fetchEquity(),
			this.fetchCostCategories()
		]);
		this.userState = user;
		this.currenciesState = equity.map((element) => element.currency);
		this.costCategoriesState = costCategories;

		this.refreshLocalStorage();
	}

	refreshLocalStorage() {
		localStorageFacade.set<domain.Auth>('auth', this.authState!);
		localStorageFacade.set<domain.User>('user', this.userState!);
		localStorageFacade.set<domain.Currency[]>('currencies', this.currenciesState!);
		localStorageFacade.set<domain.CostCategory[]>('costCategories', this.costCategoriesState!);
	}

	// USER
	async fetchUser(): Promise<domain.User> {
		const response = await client.makeRequest('/users', 'GET', this.authState?.token);
		return response.result as domain.User;
	}

	async updateUserConfiguration(requestBody: UserSettingsUpdatePartialRequestBody): Promise<void> {
		await client.makeRequest(`/users/configuration`, 'PATCH', this.authState?.token, requestBody);
	}

	// ANALYTICS & TRANSACTIONS
	async fetchEquity(): Promise<domain.Equity[]> {
		const response = await client.makeRequest('/analytics/equity', 'GET', this.authState?.token);
		return response.result as domain.Equity[];
	}
	async fetchTransactions({
		currencyId = null,
		context = 0,
		limit = 10
	}: {
		currencyId?: number | null;
		context?: number;
		limit?: number;
	}): Promise<ResponseMultiPaginated<domain.Transaction>> {
		let url = `/analytics/transactions?context=${context}&limit=${limit}`;

		if (currencyId != null) {
			url = [url, `&currencyId=${currencyId}`].join('');
		}
		const response = await client.makeRequest(url, 'GET', this.authState?.token);
		return response as ResponseMultiPaginated<domain.Transaction>;
	}

	async fetchBasicAnalyticsByPeriod(period: string): Promise<domain.TransactionBasicAnalytics[]> {
		const response = await client.makeRequest(
			`/analytics/basic?period=${period}`,
			'GET',
			this.authState?.token
		);
		return response.result as domain.TransactionBasicAnalytics[];
	}

	async fetchBasicAnalyticsFiltered(
		filters: FiltersStore
	): Promise<domain.TransactionBasicAnalytics[]> {
		let url = `/analytics/basic`;
		if (filters.startDate && filters.endDate) {
			url = `${url}?startDate=${filters.startDate}&endDate=${filters.endDate}`;
		}

		if (filters.pattern) {
			url =
				filters.startDate && filters.endDate
					? `${url}&pattern=${filters.pattern}`
					: `${url}?pattern=${filters.pattern}`;
		}
		const response = await client.makeRequest(url, 'GET', this.authState?.token);
		return response.result as domain.TransactionBasicAnalytics[];
	}

	// COSTS
	async fetchCostCategories(): Promise<domain.CostCategory[]> {
		const response = await client.makeRequest('/costs/categories', 'GET', this.authState?.token);
		return response.result as domain.CostCategory[];
	}
	async addCost(requestBody: CostCreateRequestBody): Promise<domain.Cost> {
		const response = await client.makeRequest(`/costs`, 'POST', this.authState?.token, requestBody);
		return response.result as domain.Cost;
	}
	async updateCost(costId: number, requestBody: Record<string, any>): Promise<domain.Cost> {
		const response = await client.makeRequest(
			`/costs/${costId}`,
			'PATCH',
			this.authState?.token,
			requestBody
		);
		return response.result as domain.Cost;
	}
	async fetchCost(costId: number): Promise<domain.Cost> {
		const response = await client.makeRequest(`/costs/${costId}`, 'GET', this.authState?.token);
		return response.result as domain.Cost;
	}
	async deleteCost(costId: number): Promise<void> {
		await client.makeRequest(`/costs/${costId}`, 'DELETE', this.authState?.token);
	}

	// COST SHORTCUTS
	async fetchCostShortcuts(): Promise<domain.CostShortcut[]> {
		const response = await client.makeRequest('/costs/shortcuts', 'GET', this.authState?.token);
		return response.result as domain.CostShortcut[];
	}
	async addCostShortcut(requestBody: CostShortcutCreateRequestBody): Promise<domain.CostShortcut> {
		const response = await client.makeRequest(
			`/costs/shortcuts`,
			'POST',
			this.authState?.token,
			requestBody
		);
		return response.result as domain.CostShortcut;
	}
	async deleteCostShortcut(shortcutId: number): Promise<void> {
		await client.makeRequest(`/costs/shortcuts/${shortcutId}`, 'DELETE', this.authState?.token);
	}
	async applyCostShortcut(
		shortcutId: number,
		requestBody: { value: number } | null = null
	): Promise<domain.Cost> {
		const response = await client.makeRequest(
			`/costs/shortcuts/${shortcutId}`,
			'POST',
			this.authState?.token,
			requestBody
		);
		return response.result as domain.Cost;
	}

	// INCOMES
	async addIncome(requestBody: Record<string, any>): Promise<domain.Income> {
		const response = await client.makeRequest(
			`/incomes`,
			'POST',
			this.authState?.token,
			requestBody
		);
		return response.result as domain.Income;
	}
	async updateIncome(incomeId: number, requestBody: Record<string, any>): Promise<domain.Income> {
		const response = await client.makeRequest(
			`/incomes/${incomeId}`,
			'PATCH',
			this.authState?.token,
			requestBody
		);
		return response.result as domain.Income;
	}
	async fetchIncome(incomeId: number): Promise<domain.Income> {
		const response = await client.makeRequest(`/incomes/${incomeId}`, 'GET', this.authState?.token);
		return response.result as domain.Income;
	}
	async deleteIncome(incomeId: number): Promise<void> {
		client.makeRequest(`/incomes/${incomeId}`, 'DELETE', this.authState?.token);
	}

	// EXCHANGE
	async addExchange(requestBody: Record<string, any>): Promise<domain.Exchange> {
		const response = await client.makeRequest(
			`/exchange`,
			'POST',
			this.authState?.token,
			requestBody
		);
		return response.result as domain.Exchange;
	}
	async fetchExchange(exchangeId: number): Promise<domain.Exchange> {
		const response = await client.makeRequest(
			`/exchange/${exchangeId}`,
			'GET',
			this.authState?.token
		);
		return response.result as domain.Exchange;
	}
	async deleteExchange(exchangeId: number): Promise<void> {
		client.makeRequest(`/exchange/${exchangeId}`, 'DELETE', this.authState?.token);
	}

	// NOTIFICATIONS
	async fetchNotifications(): Promise<domain.Notification[]> {
		const response = await client.makeRequest(`/notifications`, 'GET', this.authState?.token);
		return response.result as domain.Notification[];
	}
}

/*
 * DEFINE THE DATA PROXY CONTEXT
 */

export const DATA_PROXY = Symbol('DATA_PROXY');

export function getDataProxy(): DataProxy {
	return getContext<DataProxy>(DATA_PROXY);
}
