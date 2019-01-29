import { h, Component } from "preact";
import CustomLinks from "../components/customLinks";
import Score from "./score";
import Plot from "./plot";
import "./styles.scss";
import API from "../api";

export type Props = {
  asset: string;
  highlights?: string[];
  mode?: "light" | "dark";
  fontFamily?: string;
  autoWidth?: boolean;
  relatedMarkers?: {
    bucketDistance?: number;
    lineDistance?: number;
    enabled?: boolean;
    color?: string;
    fontFamily?: string;
  };
  icon?: { enabled?: boolean };
  name?: { enabled?: boolean; style?: object };
  rank?: { enabled?: boolean };
  spectrum?: { enabled: boolean };
  trend?: { enabled: boolean };
  api?: API;
};

type State = {
  metric: any;
  loading: boolean;
};

export default class SpectrumPlot extends Component<Props, State> {
  static defaultProps: Props = {
    asset: "btc",
    mode: "light",
    fontFamily: "inherit",
    relatedMarkers: { enabled: true, bucketDistance: 35, lineDistance: 25 },
    name: { enabled: true },
    spectrum: { enabled: true },
    icon: { enabled: true },
    rank: { enabled: true },
    trend: { enabled: true }
  };

  interval: NodeJS.Timeout;

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
      <div class={`fs-spectrum fs-spectrum-${props.mode}`}>
        <Score symbol={props.asset} metric={metric} {...props} mini />
        {props.spectrum.enabled && (
          <Plot symbol={props.asset} metric={metric} {...props} mini />
        )}
        <CustomLinks />
      </div>
    );
  }
}
