import { h, Component } from "preact";
import classnames from "classnames";
import Rank from "../components/rank";
import Trend from "../components/trend";
import CustomLinks from "../components/customLinks";
import API from "../api";
import "./style.scss";

import sortBy = require("lodash/sortBy");
import reverse = require("lodash/reverse");

// Define the columns, the content of their header, and how their data is rendered.
type ColumnDefinition = {
  header: string;
  renderItem: (row: Row) => any;
  sortKey?: string;
};

const COLUMNS: { [k: string]: ColumnDefinition } = {
  coin: {
    header: "Coin",
    renderItem: (row: Row) => row.symbol
  },

  fcas: {
    header: "FCAS",
    renderItem: (row: Row) => row.fcas,
    sortKey: "fcas"
  },

  trend: {
    header: "7D",
    renderItem: (row: Row) => (
      <Trend change={row.fcas_change} value={row.fcas} />
    ),
    sortKey: "fcas_change"
  },

  userActivity: {
    header: "User Activity",
    renderItem: (row: Row) => row.utility,
    sortKey: "utility"
  },

  developerBehavior: {
    header: "Developer Behavior",
    renderItem: (row: Row) => row.dev,
    sortKey: "dev"
  },

  marketMaturity: {
    header: "Market Maturity",
    renderItem: (row: Row) => row.market_maturity,
    sortKey: "market_maturity"
  },

  rank: {
    header: "Rank",
    renderItem: (row: Row) => <Rank score={row.fcas} />,
    sortKey: "fcas"
  }
};

type ColumnName =
  | "trend"
  | "developerBehavior"
  | "userActivity"
  | "marketMaturity"
  | "rank";

export type Props = {
  mode?: "light" | "dark";
  assets?: string[];
  exclusions?: string[];
  autoWidth?: boolean;
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
    color?: string;
    style?: object;
  };
  rows?: {
    alternating?: boolean;
    alternatingColors?: string[];
    dividers?: boolean;
    dividersColor?: string;
    style?: object;
  };
  api?: API;
};

type Row = {
  symbol: string;
  fcas: number;
  dev: number;
  utility: number;
  fcas_change: number;
  dev_change: number;
  utility_change: number;
  market_maturity: number;
  market_maturity_change: number;
};

type State = {
  loading: boolean;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  rows?: Row[];
};

export default class MultiTable extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      loading: true,
      sortColumn: "fcas",
      sortOrder: "desc"
    };
  }

  static defaultProps = {
    mode: "light",
    limit: 10,
    page: 1,
    sortBy: "fcas",
    fontFamily: "inherit",
    columns: [
      "trend",
      "userActivity",
      "developerBehavior",
      "marketMaturity",
      "rank"
    ],
    rows: {
      alternating: true
    },
    trend: {
      changeOver: 7
    }
  };

  async componentDidMount() {
    this._getData();
  }

  async _getData() {
    const res = await this.props.api.fetchMetrics({
      assets: this.props.assets,
      exclusions: this.props.exclusions,
      page: this.props.page,
      size: this.props.limit,
      sort_by: COLUMNS[this.state.sortColumn].sortKey,
      sort_desc: true,
      metrics: ["fcas", "utility", "dev", "market-maturity"],
      change_over: this.props.trend.changeOver
    });
    this.setState({
      loading: false,
      rows: res.data
    });
  }

  handleSort(col: string) {
    if (COLUMNS[col].sortKey) {
      const sortColumn = col;
      const sortOrder = this.state.sortOrder === "asc" ? "desc" : "asc";
      this.setState({ sortColumn, sortOrder });
    }
  }

  render(props: Props, state: State) {
    if (state.loading) return null;

    const columns = ["coin", "fcas", ...props.columns];
    const classes = classnames("fs-multi", `fs-multi-${props.mode}`, {
      "fs-multi-alternating": props.rows.alternating,
      "fs-multi-dividers": props.rows.dividers
    });

    const sortKey = COLUMNS[state.sortColumn].sortKey;
    let sortedRows = sortBy(state.rows, sortKey);
    if (state.sortOrder === "desc") {
      sortedRows = reverse(sortedRows);
    }

    const { fontFamily } = props;

    return (
      <div class={classes} style={{ fontFamily }}>
        <header class="fs-multi-header">
          {props.title && (
            <h1 class="fs-multi-title" style={props.title.style}>
              {props.title.text}
            </h1>
          )}
          <CustomLinks />
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
                  <th class={classes} onClick={() => this.handleSort(col)}>
                    <div class="fs-multi-colhead">
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
                  <td class={`fs-multi-${col}`}>
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
