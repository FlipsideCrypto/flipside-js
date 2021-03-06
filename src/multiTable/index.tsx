import { h, Component } from "preact";
import classnames from "classnames";
import Rank from "../components/rank";
import Trend from "../components/trend";
import CustomLinks from "../components/customLinks";
import API from "../api";
import { Row, ColumnName, ColumnDefinition } from "./types";
import sortBy from "lodash/sortBy";
import intersection from "lodash/intersection";
import reverse from "lodash/reverse";
import "./style.scss";

function mapConfigColumnsNames(columns: string[]): string[] {
  const actualColumnNames: { [k: string]: string } = {
    marketMaturity: "market-maturity",
    userActivity: "utility",
    developerBehavior: "dev"
  };
  return columns.map(col => actualColumnNames[col] || col);
}

const COLUMNS: { [k: string]: ColumnDefinition } = {
  symbol: {
    header: "Coin",
    renderItem: row => row.symbol
  },
  name: {
    header: "Coin",
    renderItem: row => row.asset_name || row.symbol
  },
  fcas: {
    header: "FCAS",
    renderItem: row => row.fcas,
    sortKey: "fcas"
  },
  trend: {
    header: "7D",
    renderItem: row => <Trend change={row.fcas_change} value={row.fcas} />,
    sortKey: "fcas_change"
  },
  userActivity: {
    header: "User Activity",
    renderItem: row => row.utility,
    sortKey: "utility"
  },
  developerBehavior: {
    header: "Developer Behavior",
    renderItem: row => row.dev,
    sortKey: "dev"
  },
  marketMaturity: {
    header: "Market Maturity",
    renderItem: row => row.market_maturity,
    sortKey: "market_maturity"
  },
  rank: {
    header: "Rank",
    renderItem: row => <Rank score={row.fcas} />,
    sortKey: "fcas"
  },
  volume_24h: {
    header: "Volume",
    renderItem: row =>
      `$${row.volume_24h.toLocaleString(undefined, {
        maximumFractionDigits: 0
      })}`,
    sortKey: "volume_24h"
  },
  market_cap: {
    header: "Market Cap",
    renderItem: row =>
      `$${row.market_cap.toLocaleString(undefined, {
        maximumFractionDigits: 0
      })}`,
    sortKey: "market_cap"
  },
  price: {
    header: "Price",
    renderItem: row => {
      let price: any = row.price;
      if (!price) return "NA";
      let value: number = parseFloat(parseFloat(price).toFixed(2));
      if (value === 0.0) {
        value = parseFloat(parseFloat(price).toFixed(4));
      }
      return `$${value}`;
    },
    sortKey: "price"
  }
};

export type Props = {
  widgetType?:
    | "spectrum"
    | "multi-table"
    | "table"
    | "score"
    | "chart"
    | "price-multi-table";
  mode?: "light" | "dark";
  assets?: string[];
  showFullName?: boolean;
  exclusions?: string[];
  autoWidth?: boolean;
  sortBy?: ColumnName;
  limit?: number;
  page?: number;
  columns?: ColumnName[];
  fontFamily?: string;
  title?: {
    text: string;
    style?: object;
  };
  trend?: {
    changeOver?: number;
  };
  headers?: {
    style?: object;
  };
  rows?: {
    alternating?: boolean;
    alternatingColors?: string[];
    dividers?: boolean;
    dividersColor?: string;
    style?: object;
    padding?: string;
    headerBold?: boolean;
  };
  api?: API;
};

type State = {
  loading: boolean;
  priceFilterRequired: boolean;
  filteredColumns: ColumnName[];
  pageSortBy: ColumnName;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  rows?: Row[];
};

export default class MultiTable extends Component<Props, State> {
  updateInterval: any;

  constructor(props: Props) {
    super(props);

    // if price, market_cap, or volume_24h are included in columns then remove all other columns
    let filteredColumns = props.columns;
    let priceFilterRequired = false;
    const includedMarketCapColumns = intersection(filteredColumns, [
      "price",
      "market_cap",
      "volume_24h"
    ]) as ColumnName[];
    if (includedMarketCapColumns.length > 0) {
      filteredColumns = includedMarketCapColumns;
      priceFilterRequired = true;
    } else {
      if (filteredColumns.indexOf("fcas") === -1) {
        filteredColumns = ["fcas", ...filteredColumns];
      }
    }

    this.state = {
      loading: true,
      pageSortBy: props.sortBy || props.columns[0],
      sortColumn: props.sortBy || "fcas",
      sortOrder: "desc",
      priceFilterRequired: priceFilterRequired,
      filteredColumns
    };
  }

  static defaultProps: Props = {
    mode: "light",
    limit: 10,
    page: 1,
    fontFamily: "inherit",
    columns: [
      "fcas",
      "trend",
      "userActivity",
      "developerBehavior",
      "marketMaturity",
      "rank"
    ],
    headers: {
      style: {}
    },
    rows: {
      alternating: true,
      alternatingColors: [],
      dividers: false,
      dividersColor: null,
      style: {}
    },
    trend: {
      changeOver: 7
    },
    widgetType: "multi-table"
  };

  async componentDidMount() {
    await this._getData();
    this.updateInterval = setInterval(this._getData, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  _getData = async () => {
    const res = await this.props.api.fetchMetrics({
      assets: this.props.assets,
      exclusions: this.props.exclusions,
      page: this.props.page,
      size: this.props.limit,
      sort_by: COLUMNS[this.state.sortColumn].sortKey,
      sort_desc: true,
      metrics: mapConfigColumnsNames(this.state.filteredColumns),
      change_over: this.props.trend.changeOver
    });
    this.setState({
      loading: false,
      rows: res.data
    });
  };

  handleClickSort(col: string) {
    if (COLUMNS[col].sortKey) {
      const sortColumn = col;
      const sortOrder = this.state.sortOrder === "asc" ? "desc" : "asc";
      this.setState({ sortColumn, sortOrder });
    }
  }

  render(props: Props, state: State) {
    if (state.loading) return null;
    const coinColumn = props.showFullName ? "name" : "symbol";
    const columns = [coinColumn, ...state.filteredColumns];
    const classes = classnames("fs-multi", `fs-multi-${props.mode}`, {
      "fs-multi-alternating": props.rows.alternating,
      "fs-multi-dividers": props.rows.dividers
    });

    const sortKey = COLUMNS[state.sortColumn].sortKey;
    let sortedRows = sortBy(state.rows, sortKey);
    if (state.sortOrder === "desc") {
      sortedRows = reverse(sortedRows);
    }

    const { fontFamily, widgetType } = props;

    return (
      <div class={classes} style={{ fontFamily }}>
        <header class="fs-multi-header">
          {props.title && (
            <h1 class="fs-multi-title" style={props.title.style}>
              {props.title.text}
            </h1>
          )}
          <CustomLinks widget={widgetType} api={this.props.api} />
        </header>

        <table>
          <thead>
            <tr>
              {columns.map(col => {
                const column = COLUMNS[col];
                const classes = classnames(`fs-multi-${col}`, {
                  "fs-multi-sortable": !!column.sortKey
                });
                return (
                  <th
                    class={classes}
                    onClick={() => this.handleClickSort(col)}
                    style={props.headers.style}
                  >
                    <div class="fs-multi-colhead" style={props.headers.style}>
                      {column.sortKey && (
                        <span
                          class={classnames(
                            "fs-multi-caret",
                            `fs-multi-caret-${state.sortOrder}`,
                            {
                              "fs-multi-caret-active": col === state.sortColumn
                            }
                          )}
                        />
                      )}
                      <span class="fs-multi-colhead-text">{column.header}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {sortedRows.map(asset => (
              <tr>
                {columns.map(col => (
                  <td
                    class={`fs-multi-${col}`}
                    style={{
                      borderBottom: props.rows.dividers
                        ? `1px solid ${props.rows.dividersColor}`
                        : null,
                      ...props.rows.style
                    }}
                  >
                    {COLUMNS[col].renderItem(asset)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
