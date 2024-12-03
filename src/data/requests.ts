import { Equity, ResponseMultiPaginated, ResponseMulti } from "./types";
import { Transaction } from "./types";

const BASE_URL = "http://localhost:8000";
// const BASE_URL = "http://0.0.0.0:8000";
// const BASE_URL = "http://192.168.50.161:8000";

async function validateResponse(response: Response) {
  const data = await response.json();
  if (response.status == 200) {
    return data;
  } else {
    throw new Error(data["message"]);
  }
}

async function makeRequest(
  url: string,
  method: string = "GET",
  headers: Record<string, string> = {},
) {
  // TODO: Use the secret from the session storage instead
  const token = "secret";

  let defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return await fetch(url, {
    method: method,
    headers: { ...defaultHeaders, ...headers },
  });
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
  const response = await makeRequest(url);
  const result: ResponseMultiPaginated<Transaction> =
    await validateResponse(response);

  return result;
}

export async function fetchEquity(): Promise<ResponseMulti<Equity>> {
  const mockedResults = [
    {
      amount: 14671.23,
      currency: { id: 1, name: "USD", sign: "$" },
    },
    {
      amount: 500.44,
      currency: { id: 2, name: "UAH", sign: "₴" },
    },
  ];

  return { result: mockedResults } as ResponseMulti<Equity>;
}
