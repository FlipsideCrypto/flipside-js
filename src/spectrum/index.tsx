import { h, Component } from "preact";
import Score from "./score";
import Plot from "./plot";
import "./styles.scss";
import API from "../api";

export type Props = {
  asset: string;
  highlights?: string[];
  mode?: "light" | "dark";
  autoWidth?: boolean;
  bucketDistance?: number;
  relatedMarkers?: {
    enabled?: boolean;
    color?: string;
    fontFamily?: string;
  };
  icon?: {
    enabled?: boolean;
  };
  name?: {
    enabled?: boolean;
    style?: object;
  };
  rank?: {
    enabled?: boolean;
  };
  spectrum?: {
    enabled: boolean;
  };
  trend?: {
    enabled: boolean;
  };
  // symbol: string;
  api: API;
  // opts: any;
};

type State = {
  metric: any;
  loading: boolean;
};

export default class FCAS extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    asset: "btc",
    mode: "light",
    spectrum: {
      enabled: true
    },
    icon: {
      enabled: true
    }
  };

  interval: number;

  constructor() {
    super();
    this.state = { loading: true, metric: null };
  }

  async _getData() {
    const { data, success } = await this.props.api.fetchAssetMetric(
      this.props.asset,
      "FCAS"
    );

    if (!success || !data) {
      setTimeout(() => {
        return this._getData();
      }, 2000);
      return success;
    }

    this.setState({
      loading: false,
      metric: {
        fcas: Math.round(data.value),
        change: data.percent_change,
        name: data.asset_name
      }
    });
    return success;
  }

  _update() {
    this.interval = setInterval(async () => {
      await this._getData();
    }, 300000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async componentDidMount() {
    const success = await this._getData();
    if (!success) {
      this.setState({
        loading: false,
        metric: {
          fcas: "NA",
          change: "NA",
          name: "NA"
        }
      });
    }
    this._update();
  }

  render(props: Props, { metric, loading }: State) {
    if (loading) return null;
    return (
      <div class="fs-container">
        <Score symbol={props.asset} metric={metric} {...props} mini />
        {props.spectrum.enabled && (
          <Plot symbol={props.asset} metric={metric} {...props} mini />
        )}
      </div>
    );
  }
}
