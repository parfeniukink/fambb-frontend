import * as sessionStorageRepository from "./sessionStorageRepository";
import type {
  Equity,
  ResponseMultiPaginated,
  ResponseMulti,
  Response,
  Currency,
  CostCategory,
  User,
  Transaction,
} from "./types";

const BASE_URL = "http://localhost:8000";
// const BASE_URL = "http://192.168.50.161:8000";
// const BASE_URL = "http://192.168.0.130:8000";

// **********************************************
// HTTP request factory
// **********************************************
async function makeRequest(
  url: string,
  method: string = "GET",
  headers: Record<string, string> = {},
  body: Record<string, any> = {},
): Promise<any> {
  const secret: string | null = sessionStorageRepository.getSecret();

  if (!secret) {
    sessionStorage.clear();
    throw new Error("user unauthorized");
  }

  let defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secret}`,
  };

  const response = await fetch(url.toString(), {
    method: method,
    headers: { ...defaultHeaders, ...headers },
    body:
      body && ["POST", "PATCH"].find((item) => item == method)
        ? JSON.stringify(body)
        : null,
  });

  const data = await response.json();
  if (response.status >= 200 && response.status < 300) {
    return data;
  } else if (response.status == 401) {
    // clear data after unauthorized
    sessionStorage.clear();
    throw new Error("user unauthorized");
  } else if (response.status == 400 || response.status == 422) {
    if (response) {
      throw new Error(data.message);
    }
  } else {
    throw new Error(`Unhandled error. Status code: ${response.status}}`);
  }
}

// ==============================================
// fetch analytics information
// ==============================================

export async function fetchEquity(): Promise<ResponseMulti<Equity>> {
  return (await makeRequest(
    `${BASE_URL}/analytics/equity`,
  )) as ResponseMulti<Equity>;
}

export async function fetchTransactions({
  currencyId = null,
  context = 0,
  limit = 10,
}: {
  currencyId?: number | null;
  context?: number;
  limit?: number;
}): Promise<ResponseMultiPaginated<Transaction>> {
  let url = `${BASE_URL}/analytics/transactions?context=${context}&limit=${limit}`;

  if (currencyId != null) {
    url = [url, `&currencyId=${currencyId}`].join("");
  }
  return (await makeRequest(url)) as ResponseMultiPaginated<Transaction>;
}

// ==============================================
// fetch currencies
// ==============================================
export async function fetchCurrencies(): Promise<ResponseMulti<Currency>> {
  return (await makeRequest(
    `${BASE_URL}/currencies`,
  )) as ResponseMulti<Currency>;
}

// ==============================================
// fetch cost categories
// ==============================================
export async function fetchCostCategories(): Promise<
  ResponseMulti<CostCategory>
> {
  return (await makeRequest(
    `${BASE_URL}/costs/categories`,
  )) as ResponseMulti<CostCategory>;
}

// ==============================================
// fetch user information
// ==============================================
export async function fetchUser(): Promise<Response<User>> {
  return (await makeRequest(`${BASE_URL}/users`)) as Response<User>;
}

// ==============================================
// transactions CRUD
// ==============================================
export async function addCost(requestBody: Record<string, any>) {
  return await makeRequest(`${BASE_URL}/costs`, "POST", {}, requestBody);
}
export async function getCost(itemId: number) {
  return await makeRequest(`${BASE_URL}/costs/${itemId}`, "GET");
}

export async function updateCost(
  costId: number,
  requestBody: Record<string, any>,
) {
  return await makeRequest(
    `${BASE_URL}/costs/${costId}`,
    "PATCH",
    {},
    requestBody,
  );
}

export async function deleteCost(costId: number): Promise<void> {
  await makeRequest(`${BASE_URL}/costs/${costId}`, "DELETE");
}

export async function addIncome(requestBody: Record<string, any>) {
  return await makeRequest(`${BASE_URL}/incomes`, "POST", {}, requestBody);
}
export async function getIncome(itemId: number) {
  return await makeRequest(`${BASE_URL}/incomes/${itemId}`, "GET");
}

export async function updateIncome(
  incomeId: number,
  requestBody: Record<string, any>,
) {
  return await makeRequest(
    `${BASE_URL}/incomes/${incomeId}`,
    "PATCH",
    {},
    requestBody,
  );
}

export async function deleteIncome(incomeId: number) {
  await makeRequest(`${BASE_URL}/incomes/${incomeId}`, "DELETE");
}

export async function currencyExchange(requestBody: Record<string, any>) {
  return await makeRequest(`${BASE_URL}/exchange`, "POST", {}, requestBody);
}
export async function getExchange(itemId: number) {
  return await makeRequest(`${BASE_URL}/exchange/${itemId}`, "GET");
}

export async function deleteExchange(exchangeId: number) {
  return await makeRequest(
    `${BASE_URL}/exchange/${exchangeId}`.toString(),
    "DELETE",
  );
}

// ==============================================
// basic analytics
// ==============================================
export async function getBasicAnalytics(period: string) {
  return await makeRequest(
    `${BASE_URL}/analytics/basic?period=${period}`,
    "GET",
  );
}
