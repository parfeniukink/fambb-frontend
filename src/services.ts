import * as localStorageRepository from "./data/localStorageRepository";

export function formatAmount(amount: number): string {
  let formatted = amount.toFixed(2);
  let [integerPart, decimalPart] = formatted.split(".");

  let formattedIntegetr = "";
  for (let i = 0; i < integerPart.length; i++) {
    if (i > 0 && (integerPart.length - i) % 3 === 0) {
      formattedIntegetr += " ";
    }
    formattedIntegetr += integerPart[i];
  }

  return `${formattedIntegetr}.${decimalPart}`;
}

export function isAuthorized(): boolean {
  const user = localStorageRepository.getUser();
  const costCategories = localStorageRepository.getCostCategories();
  const secret = localStorageRepository.getSecret();
  return user && costCategories && secret ? true : false;
}

export function validateMoney(data: any): number {
  try {
    return parseFloat(String(data).trim().replace(",", "."));
  } catch (e) {
    console.error("can't parse money: ", data);
    throw Error(String(e));
  }
}
