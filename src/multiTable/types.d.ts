export type Row = {
  symbol: string;
  asset_name: string;
  fcas: number;
  dev: number;
  utility: number;
  fcas_change: number;
  dev_change: number;
  utility_change: number;
  market_maturity: number;
  market_maturity_change: number;
  percent_change_7d: number;
  percent_change_24h: number;
  percent_change_1h: number;
  market_cap: number;
  price: number;
  volume_24h: number;
};

// Define the columns, the content of their header, and how their data is rendered.
type ColumnDefinition = {
  header: string;
  renderItem: (row: Row) => any;
  sortKey?: string;
};

type ColumnName =
  | "fcas"
  | "trend"
  | "developerBehavior"
  | "userActivity"
  | "marketMaturity"
  | "rank"
  | "volume_24h"
  | "market_cap"
  | "price";
