import { h, Component } from "preact";
import classnames from "classnames";
import API from "../api";
import "./style.scss";

// Define the columns, the content of their header, and how their data is rendered.
type ColumnDefinition = {
  header: string;
  renderItem: (row: Row) => any;
  sortable?: boolean;
};
const COLUMNS: { [k: string]: ColumnDefinition } = {
  coin: {
    header: "Coin",
    renderItem: (row: Row) => row.symbol
  },

  fcas: {
    header: "FCAS",
    renderItem: (row: Row) => row.fcas,
    sortable: true
  },

  trend: {
    header: "7D",
    renderItem: (row: Row) => row.change_over
  },

  userActivity: {
    header: "User Activity",
    renderItem: (_row: Row) => "usr_act",
    sortable: true
  },

  developerBehavior: {
    header: "Developer Behavior",
    renderItem: (row: Row) => row.dev,
    sortable: true
  },

  marketMaturity: {
    header: "Market Maturity",
    renderItem: (row: Row) => row.utility,
    sortable: true
  },

  rank: {
    header: "Rank",
    renderItem: (row: Row) => row.fcas,
    sortable: true
  }
};

type ColumnName = "trend" | "developerBehavior" | "marketMaturity" | "rank";

export type Props = {
  mode?: "light" | "dark";
  assets?: string | string[];
  autoWidth?: boolean;
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
  change_over: number;
};

type State = {
  loading: boolean;
  sortKey: string;
  sortOrder: "asc" | "desc";
  rows?: Row[];
};

export default class MultiTable extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      loading: true,
      sortKey: "rank",
      sortOrder: "asc"
    };
  }

  static defaultProps = {
    mode: "light",
    columns: [
      "trend",
      "userActivity",
      "developerBehavior",
      "marketMaturity",
      "rank"
    ],
    rows: {
      alternating: true
    }
  };

  async componentDidMount() {
    this._getData();
  }

  async _getData() {
    const res = await this.props.api.fetchMetrics(["btc", "eth"]);
    this.setState({
      loading: false,
      rows: res.data
    });
  }

  handleSort(col: string) {
    if (COLUMNS[col].sortable) {
      this.setState({ sortKey: col });
    }
  }

  render(props: Props, state: State) {
    if (state.loading) return null;

    const columns = ["coin", "fcas", ...props.columns];
    const classes = classnames("fs-multi", `fs-multi-${props.mode}`, {
      "fs-multi-alternating": props.rows.alternating,
      "fs-multi-dividers": props.rows.dividers
    });

    return (
      <div class={classes}>
        <header>
          {props.title && <h1 style={props.title.style}>{props.title.text}</h1>}
          <p>
            Powered by <a href="#">Flipside Crypto</a>
          </p>
          <a href="#">What's FCAS?</a>
        </header>

        <table>
          <thead>
            <tr>
              {columns.map(col => {
                const column = COLUMNS[col];
                const classes = classnames(`fs-multi-${col}`, {
                  "fs-multi-sortable": column.sortable
                });
                return (
                  <th class={classes} onClick={() => this.handleSort(col)}>
                    {state.sortKey === col && <span class={`fs-multi-caret`} />}
                    {column.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {state.rows.map(asset => (
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
