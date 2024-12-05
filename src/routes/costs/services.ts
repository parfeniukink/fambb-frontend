import { Configuration } from "../../data/types";

// Use this structure to create a "Cost" by sending the request to the backend
export class CostCreateRequestBody {
  name: string | null = null;
  value: number | null = null;
  timestamp: string = this.today();
  currencyId: number | null = null;
  categoryId: number | null = null;

  constructor(configuration: Configuration | null = null) {
    if (configuration != null) {
      this.currencyId = configuration.defaultCurrency
        ? configuration.defaultCurrency.id
        : null;
      this.categoryId = configuration.defaultCostCategory
        ? configuration.defaultCostCategory.id
        : null;
      this.timestamp = this.today();
    }
  }

  private today() {
    return new Date().toISOString().slice(0, 10);
  }

  // defines if the data is ready to be sent
  public readyToGo() {
    if (
      this.name &&
      this.value &&
      this.timestamp &&
      this.currencyId &&
      this.categoryId
    ) {
      return true;
    } else {
      return false;
    }
  }
}
