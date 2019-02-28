import { h, Component } from "preact";
import CustomLinks from "../components/customLinks";
import Plot from "./plot";
import * as css from "./style.css";
import API, { WidgetLinksLink } from "../api";
import Rank from "../components/rank";
import Trend from "../components/trend";
import Carousel from "./components/carousel";
import { defaultFlipsideLink } from "../utils";

export type BootstrapAssetType = {
  value: number;
  percent_change: number;
  asset_name: string;
};

type BootstrapHighlightType = {
  symbol: string;
  value: number;
};

export type AssetType = {
  symbol: string;
  highlights?: string[];
  bootstrapAsset?: BootstrapAssetType;
  bootstrapHighlights?: BootstrapHighlightType[];
};

export type Props = {
  asset?: AssetType;
  assets?: AssetType[];
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
  bootstrapFCASDistribution?: any;
  disableLinks?: boolean;
  linkBootstrap?: WidgetLinksLink[];
};

type State = {
  loading: boolean;
  metric: {
    name: string;
    fcas: number;
    change: number;
  };
};

class Spectrum extends Component<Props, State> {
  interval: number;

  static defaultProps = {
    mode: "light"
  };

  constructor() {
    super();
    this.state = { loading: true, metric: null };
  }

  async _getData() {
    let data: BootstrapAssetType;
    let success: boolean;

    if (!this.props.asset.bootstrapAsset) {
      let result = await this.props.api.fetchAssetMetric(
        this.props.asset.symbol,
        "FCAS"
      );
      data = result.data;
      success = result.success;
    } else {
      data = this.props.asset.bootstrapAsset;
      success = true;
    }

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
    this.interval = window.setInterval(async () => {
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
          name: "NA",
          fcas: 0,
          change: 0
        }
      });
    }
    this._update();
  }

  render(props: Props, state: State) {
    if (state.loading) return null;

    const { asset, mode, rank, trend, api } = props;
    const { metric } = state;

    return (
      <div class={css[mode]}>
        <div class={css.header}>
          <img
            class={css.icon}
            src={`https://d301yvow08hyfu.cloudfront.net/svg/color/${asset.symbol.toLowerCase()}.svg`}
          />
          <span class={css.name}>{metric.name}</span>
        </div>

        <div class={css.meta}>
          <span class={css.symbol}>{asset.symbol}</span>
          <span class={css.fcas}>Health {metric.fcas}</span>
          {trend.enabled && (
            <span class={css.trend}>
              <Trend change={metric.change} value={metric.fcas} />
            </span>
          )}
          {rank.enabled && (
            <a href={defaultFlipsideLink(api.key, "spectrum")}>
              <span class={css.rank}>
                <Rank score={metric.fcas} kind="normal" />
              </span>
            </a>
          )}
        </div>

        {props.spectrum.enabled && <Plot metric={metric} {...props} />}

        {props.disableLinks === false && (
          <CustomLinks
            widget="spectrum"
            api={props.api}
            linkBootstrap={props.linkBootstrap}
          />
        )}
      </div>
    );
  }
}

const MultiSpectrum = (props: Props) => {
  let assets = [props.asset];
  if (props.assets.length > 0) {
    assets = props.assets;
  }

  return (
    <Carousel
      mode={props.mode}
      items={assets}
      renderSlide={(item: any) => <Spectrum {...props} asset={item} />}
    />
  );
};

MultiSpectrum.defaultProps = {
  asset: {
    symbol: "btc",
    highlights: ["eth", "zec", "zrx"],
    bootstrapAsset: null,
    bootstrapHighlights: null
  },
  disableLinks: false,
  assets: [],
  mode: "light",
  fontFamily: "inherit",
  relatedMarkers: {
    enabled: true,
    bucketDistance: 35,
    lineDistance: 25,
    fontFamily: "inherit"
  },
  name: { enabled: true },
  spectrum: { enabled: true },
  icon: { enabled: true },
  rank: { enabled: true },
  trend: { enabled: true },
  linkBootstrap: null
} as Props;

export default MultiSpectrum;
