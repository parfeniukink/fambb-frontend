import {
  Equity,
  ResponseMultiPaginated,
  ResponseMulti,
  Response,
  Currency,
  CostCategory,
  User,
} from "./types";
import { Transaction } from "./types";

const BASE_URL = "http://localhost:8000";
// const BASE_URL = "http://0.0.0.0:8000";
// const BASE_URL = "http://192.168.50.161:8000";

// **********************************************
// HTTP request factory
// **********************************************
async function makeRequest(
  url: string,
  method: string = "GET",
  headers: Record<string, string> = {},
  body: Record<string, any> = {},
) {
  // TODO: Use the secret from the session storage instead
  const token = "secret";

  let defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    method: method,
    headers: { ...defaultHeaders, ...headers },
    body:
      body && ["POST", "PATCH"].find((item) => item == method)
        ? JSON.stringify(body)
        : null,
  });

  const data = await response.json();
  if (response.status == 200) {
    return data;
  } else {
    throw new Error(data["message"]);
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

export async function fetchTransactions(
  currencyId: number | null = null,
  context: number = 0,
  limit: number = 10,
): Promise<ResponseMultiPaginated<Transaction>> {
  let url = `${BASE_URL}/analytics/transactions?context=${context}&limit=${limit}`;

  // add currency id filter if specified
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
// transactions operations
// ==============================================
export async function addCost(requestBody: Record<string, any>) {
  await makeRequest(`${BASE_URL}/costs`, "POST", {}, requestBody);
}
