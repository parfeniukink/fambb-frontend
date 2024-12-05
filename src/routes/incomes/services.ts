import { Configuration } from "../../data/types";

// Use this structure to create a "Cost" by sending the request to the backend
export class IncomeCreateRequestBody {
  name: string | null = null;
  value: number | null = null;
  source: string = "revenue";
  timestamp: string | null = null;
  currencyId: number | null = null;

  constructor(configuration: Configuration) {
    this.source = "revenue";
    this.currencyId = configuration.defaultCurrency
      ? configuration.defaultCurrency.id
      : null;
    this.timestamp = this.today();
  }

  private today() {
    return new Date().toISOString().slice(0, 10);
  }

  // defines if the data is ready to be sent
  public readyToGo() {
    if (
      this.name &&
      this.value &&
      this.source &&
      this.timestamp &&
      this.currencyId
    ) {
      return true;
    } else return false;
  }
}
