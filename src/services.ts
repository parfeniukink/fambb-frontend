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
