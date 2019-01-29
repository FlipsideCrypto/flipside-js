import { h, Component } from "preact";
import classnames from "classnames";
import Rank from "../components/rank";
import Trend from "../components/trend";
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
    sortKey: "change_over"
  },

  userActivity: {
    header: "User Activity",
    renderItem: (_row: Row) => "usr_act",
    sortKey: "usr_act"
  },

  developerBehavior: {
    header: "Developer Behavior",
    renderItem: (row: Row) => row.dev,
    sortKey: "dev"
  },

  marketMaturity: {
    header: "Market Maturity",
    renderItem: (row: Row) => row.utility,
    sortKey: "utility"
  },

  rank: {
    header: "Rank",
    renderItem: (row: Row) => <Rank score={row.fcas} />,
    sortKey: "fcas"
  }
};

type ColumnName = "trend" | "developerBehavior" | "marketMaturity" | "rank";

export type Props = {
  mode?: "light" | "dark";
  assets?: string[];
  exclusions?: string[];
  autoWidth?: boolean;
  size?: number;
  limit?: number;
  columns?: ColumnName[];
  title?: {
    text: string;
    style?: object;
  };
  trends?: {
    enabled: boolean;
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
      sortOrder: "asc"
    };
  }

  static defaultProps = {
    mode: "light",
    size: 10,
    sortBy: "fcas",
    columns: ["trend", "developerBehavior", "marketMaturity", "rank"],
    rows: {
      alternating: true
    }
  };

  async componentDidMount() {
    this._getData();
  }

  async _getData() {
    const res = await this.props.api.fetchMetrics({
      assets: this.props.assets,
      exclusions: this.props.exclusions,
      page: 1,
      size: 10,
      sort_by: COLUMNS[this.state.sortColumn].sortKey,
      sort_desc: false,
      metrics: ["fcas", "utility", "dev"]
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

    return (
      <div class={classes}>
        <header class="fs-multi-header">
          {props.title && (
            <h1 class="fs-multi-title" style={props.title.style}>
              {props.title.text}
            </h1>
          )}
          <p class="fs-multi-custom1">
            Powered by <a href="https://flipsidecrypto.com">Flipside Crypto</a>
          </p>
          <p class="fs-multi-custom2">
            <a href="https://flipsidecrypto.com/fcas">What's FCAS?</a>
          </p>
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
