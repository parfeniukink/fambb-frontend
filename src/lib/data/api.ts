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
import type {
  PaginatedResponse,
  Response,
  ResponseMulti,
} from "$lib/types/response"
import * as mock from "./mock"
import { persistent } from "./persistent.svelte"
import { notification } from "$lib/services/notifications"

const BASE_URL = "http://192.168.50.151:8000"

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

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  return response.json() as T
}

// ─────────────────────────────────────────────────────────
// user related
// ─────────────────────────────────────────────────────────
export async function userAuth(
  request: UserAuthRequestBody
): Promise<Response<Identity>> {
  return await apiCall<Response<Identity>>("/identity/auth", "POST", request)
}

// ─────────────────────────────────────────────────────────
// transactions related
// ─────────────────────────────────────────────────────────
export async function transactionsList(
  context: number = 0,
  limit: number = 10,
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

// costs related
export async function costCategoriesList(): Promise<
  ResponseMulti<CostCategory>
> {
  const response =
    await apiCall<ResponseMulti<CostCategory>>("/costs/categories")

  return response
}

export async function costCreate(
  requestBody: CostCreateRequestBody
): Promise<Response<Cost>> {
  return apiCall<Response<Cost>>("/costs", "POST", requestBody)
}

export async function costRetrieve(costId: number): Promise<Response<Cost>> {
  return apiCall<Response<Cost>>(`/costs/${costId}`)
}

export async function costUpdate(
  costId: number,
  requestBody: CostPartialUpdateRequestBody
): Promise<Response<Cost>> {
  return apiCall<Response<Cost>>(`/costs/${costId}`, "PATCH", requestBody)
}

export async function costDelete(costId: number): Promise<void> {
  return apiCall(`/costs/${costId}`, "DELETE")
}

// Cost Shortcuts
export async function costShortcutCreate(
  requestBody: CostShortcutCreateRequestBody
): Promise<Response<CostShortcut>> {
  return apiCall<Response<CostShortcut>>(
    "/costs/shortcuts",
    "POST",
    requestBody
  )
}

export async function costShortcutsList(): Promise<
  ResponseMulti<CostShortcut>
> {
  return apiCall<ResponseMulti<CostShortcut>>("/costs/shortcuts")
}

export async function costShortcutDelete(
  costShortcutId: number
): Promise<void> {
  return apiCall(`/costs/shortcuts/${costShortcutId}`, "DELETE")
}

export async function costShortcutApply(
  shortcutId: number,
  requestBody?: CostShortcutApplyRequestBody
): Promise<Response<Cost>> {
  return apiCall<Response<Cost>>(
    `/costs/shortcuts/${shortcutId}`,
    "POST",
    requestBody ?? undefined
  )
}

// Incomes
export async function incomeCreate(
  requestBody: IncomeCreateRequestBody
): Promise<Response<Income>> {
  return apiCall<Response<Income>>(`/incomes`, "POST", requestBody)
}

export async function incomeRetrieve(
  incomeId: number
): Promise<Response<Income>> {
  return apiCall<Response<Income>>(`/incomes/${incomeId}`)
}

export async function incomeUpdate(
  incomeId: number,
  requestBody: IncomePartialUpdateRequestBody
) {
  return apiCall<Response<Income>>(`/incomes/${incomeId}`, "PATCH", requestBody)
}

export async function incomeDelete(incomeId: number): Promise<void> {
  return apiCall(`/incomes/${incomeId}`, "DELETE")
}

// Currency Exchange
export async function exchangeCreate(
  requestBody: ExchangeCreateRequestBody
): Promise<Response<Exchange>> {
  return apiCall<Response<Exchange>>(`/exchange`, "POST", requestBody)
}

export async function exchangeRetrieve(
  exchangeId: number
): Promise<Response<Exchange>> {
  return apiCall<Response<Exchange>>(`/exchange/${exchangeId}`)
}

export async function exchangeDelete(exchangeId: number): Promise<void> {
  return apiCall(`/exchange/${exchangeId}`, "DELETE")
}

// ─────────────────────────────────────────────────────────
// analytics related
// ─────────────────────────────────────────────────────────
export async function equityList(): Promise<ResponseMulti<Equity>> {
  return apiCall<ResponseMulti<Equity>>("/analytics/equity")
}
