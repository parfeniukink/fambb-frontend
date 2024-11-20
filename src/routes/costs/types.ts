import { Currency, CostCategory, User, Configuration } from "../../types";

export class Input {
  currencies: Array<Currency> = [
    { id: 1, name: "USD", sign: "$" },
    { id: 2, name: "UAH", sign: "#" },
  ];

  costCategories: Array<CostCategory> = [
    { id: 1, name: "Food" },
    { id: 2, name: "Services" },
    { id: 3, name: "Taxes" },
    { id: 4, name: "Gifts" },
  ];

  user: User = {
    id: 1,
    name: "John",
    configuration: {
      defaultCurrency: this.currencies[0],
      defaultCostCategory: this.costCategories[1],
      costTemplates: ["Pizza delivery", "Fuel", "Other"],
    },
  };

  costTempaltes: Array<string> = ["Silpo", "Food", "Fuel"];
}

// Use this structure to create a "Cost" by sending the request to the backend
export class CostCreateRequestBody {
  name: string | null = null;
  value: number | null = null;
  timestamp: Date = new Date();
  currency_id: number | null = null;
  category_id: number | null = null;

  constructor(configuration: Configuration) {
    this.currency_id = configuration.defaultCurrency
      ? configuration.defaultCurrency.id
      : null;
    this.category_id = configuration.defaultCostCategory
      ? configuration.defaultCostCategory.id
      : null;
    this.timestamp = new Date();
  }

  // defines if the data is ready to be sent
  public readyToGo() {
    if (
      this.name &&
      this.value &&
      this.currency_id &&
      this.category_id &&
      this.timestamp
    ) {
      return true;
    } else {
      return false;
    }
  }
}
