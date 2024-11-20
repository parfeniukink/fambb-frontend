export type Currency = {
  id: number;
  name: string;
  sign: string;
};

export type CostCategory = {
  id: number;
  name: string;
};

export type Configuration = {
  defaultCurrency: Currency | null;
  defaultCostCategory: CostCategory | null;
  costTemplates: Array<string> | null;
};

export type User = {
  id: number;
  name: string;
  configuration: Configuration;
};
