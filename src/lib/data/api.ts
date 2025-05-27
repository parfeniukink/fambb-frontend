import type {
  CostCategory,
  CostCreateRequestBody,
  CostShortcutCreateRequestBody,
  Cost,
  Transaction,
  CostShortcut,
  IncomeCreateRequestBody,
  Income,
  ExchangeCreateRequestBody,
  Exchange,
  Equity,
  CostShortcutApplyRequestBody,
  CostPartialUpdateRequestBody,
  IncomePartialUpdateRequestBody,
} from "$lib/types/money"
import type { Identity, UserAuthRequestBody } from "$lib/types/identity"
import type { Notification } from "$lib/types/notifications"
import type {
  PaginatedResponse,
  Response,
  ResponseMulti,
} from "$lib/types/response"
import { persistent } from "./persistent.svelte"
import type {
  TransactionsBasicAnalytics,
  AnalyticsFiltersQueryParams,
} from "$lib/types/analytics"

const BASE_URL = "http://localhost:8000"

export async function apiCall<T>(
  url: string,
  method: string = "GET",
  body?: Record<string, any>
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (persistent.identity?.accessToken) {
    headers["Authorization"] = `Bearer ${persistent.identity.accessToken}`
  }

  const fullUrl = `${BASE_URL}${url}`

  const response = await fetch(fullUrl, {
    method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  if (response.status === 204) return null as T

  return response.json() as T
}

// ─────────────────────────────────────────────────────────
// IDENTITY
// ─────────────────────────────────────────────────────────
export async function userAuth(
  request: UserAuthRequestBody
): Promise<Response<Identity>> {
  return await apiCall<Response<Identity>>("/identity/auth", "POST", request)
}

// ─────────────────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────────────────
export async function transactionsList(
  context: number = 0,
  limit: number = 15,
  currencyId: number | null = null
): Promise<PaginatedResponse<Transaction>> {
  let url = `/analytics/transactions?context=${context}&limit=${limit}`

  if (currencyId != null) {
    url = [url, `&currencyId=${currencyId}`].join("")
  }

  const results: PaginatedResponse<Transaction> =
    await apiCall<PaginatedResponse<Transaction>>(url)

  const newContext = context + results.result.length

  return {
    context: newContext,
    left: results.left,
    result: results.result,
  }
}

// COSTS
export async function costCategoriesList(): Promise<
  ResponseMulti<CostCategory>
> {
  return await apiCall<ResponseMulti<CostCategory>>("/costs/categories")
}

export async function costCreate(
  requestBody: CostCreateRequestBody
): Promise<Response<Cost>> {
  return await apiCall<Response<Cost>>("/costs", "POST", requestBody)
}

export async function costRetrieve(costId: number): Promise<Response<Cost>> {
  return await apiCall<Response<Cost>>(`/costs/${costId}`)
}

export async function costUpdate(
  costId: number,
  requestBody: CostPartialUpdateRequestBody
): Promise<Response<Cost>> {
  return await apiCall<Response<Cost>>(`/costs/${costId}`, "PATCH", requestBody)
}

export async function costDelete(costId: number): Promise<void> {
  await apiCall<void>(`/costs/${costId}`, "DELETE")
}

// COST SHORTCUTS
export async function costShortcutCreate(
  requestBody: CostShortcutCreateRequestBody
): Promise<Response<CostShortcut>> {
  return await apiCall<Response<CostShortcut>>(
    "/costs/shortcuts",
    "POST",
    requestBody
  )
}

export async function costShortcutsList(): Promise<
  ResponseMulti<CostShortcut>
> {
  return await apiCall<ResponseMulti<CostShortcut>>("/costs/shortcuts")
}

export async function costShortcutDelete(
  costShortcutId: number
): Promise<void> {
  await apiCall(`/costs/shortcuts/${String(costShortcutId)}`, "DELETE")
}

export async function costShortcutApply(
  shortcutId: number,
  requestBody?: CostShortcutApplyRequestBody
): Promise<Response<Cost>> {
  return await apiCall<Response<Cost>>(
    `/costs/shortcuts/${shortcutId}`,
    "POST",
    requestBody ?? undefined
  )
}

// INCOMES
export async function incomeCreate(
  requestBody: IncomeCreateRequestBody
): Promise<Response<Income>> {
  return await apiCall<Response<Income>>(`/incomes`, "POST", requestBody)
}

export async function incomeRetrieve(
  incomeId: number
): Promise<Response<Income>> {
  return await apiCall<Response<Income>>(`/incomes/${incomeId}`)
}

export async function incomeUpdate(
  incomeId: number,
  requestBody: IncomePartialUpdateRequestBody
) {
  return await apiCall<Response<Income>>(
    `/incomes/${incomeId}`,
    "PATCH",
    requestBody
  )
}

export async function incomeDelete(incomeId: number): Promise<void> {
  await apiCall(`/incomes/${incomeId}`, "DELETE")
}

// CURRENCY EXCHANGE
export async function exchangeCreate(
  requestBody: ExchangeCreateRequestBody
): Promise<Response<Exchange>> {
  return await apiCall<Response<Exchange>>(`/exchange`, "POST", requestBody)
}

export async function exchangeRetrieve(
  exchangeId: number
): Promise<Response<Exchange>> {
  return await apiCall<Response<Exchange>>(`/exchange/${exchangeId}`)
}

export async function exchangeDelete(exchangeId: number): Promise<void> {
  await apiCall(`/exchange/${exchangeId}`, "DELETE")
}

// ─────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────
export async function notificationsList(): Promise<Notification[]> {
  const response = await apiCall<ResponseMulti<Notification>>("/notifications")
  return response.result
}

// ─────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────
export async function equityList(): Promise<ResponseMulti<Equity>> {
  return await apiCall<ResponseMulti<Equity>>("/analytics/equity")
}

export async function fetchBasicAnalyticsByPeriod(
  period: string
): Promise<TransactionsBasicAnalytics[]> {
  const response = await apiCall<ResponseMulti<TransactionsBasicAnalytics>>(
    `/analytics/basic?period=${period}`,
    "GET"
  )
  return response.result
}

export async function fetchBasicAnalyticsFiltered(
  filters: AnalyticsFiltersQueryParams
): Promise<TransactionsBasicAnalytics[]> {
  let url = `/analytics/basic`
  if (filters.startDate && filters.endDate) {
    url = `${url}?startDate=${filters.startDate}&endDate=${filters.endDate}`
  }

  if (filters.pattern) {
    url =
      filters.startDate && filters.endDate
        ? `${url}&pattern=${filters.pattern}`
        : `${url}?pattern=${filters.pattern}`
  }
  const response = await apiCall<ResponseMulti<TransactionsBasicAnalytics>>(
    url,
    "GET"
  )
  return response.result
}
