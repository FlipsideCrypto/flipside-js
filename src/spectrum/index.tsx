import { h, Component } from "preact";
import CustomLinks from "../components/customLinks";
import Plot from "./plot";
import * as css from "./style.css";
import API, { WidgetLinksLink } from "../api";
import Rank from "../components/rank";
import Trend from "../components/trend";
import Carousel from "./components/carousel";
import { defaultFlipsideLink } from "../utils";
import NoDataMessage from "../components/noDataMessage";
import find from "lodash/find";

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
  asset_id?: string;
  symbol?: string;
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
  showHeader?: boolean;
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
  data?: {
    value: number;
    symbol: string;
    slug: string;
    grade?: string;
    percent_change: number;
    point_change?: number;
    asset_name: string;
    has_rank: boolean;
  };
  metric: {
    name: string;
    fcas: number;
    change: number;
  };
  widgetLinks: WidgetLinksLink[];
};

class Spectrum extends Component<Props, State> {
  interval: number;

  static defaultProps = {
    mode: "light",
  };

  constructor() {
    super();
    this.state = { loading: true, metric: null, widgetLinks: [] };
  }

  async _getData() {
    let data: BootstrapAssetType;
    let success: boolean;
    const assetId = this.props.asset.asset_id || this.props.asset.symbol;
    if (!this.props.asset.bootstrapAsset) {
      let result = await this.props.api.fetchAssetMetric(assetId, "FCAS");
      data = result.data;
      success = result.success;
    } else {
      data = this.props.asset.bootstrapAsset;
      success = true;
    }

    let widgetLinks;
    if (this.props.linkBootstrap) {
      widgetLinks = this.props.linkBootstrap;
    } else {
      let widgetLinksResp = await this.props.api.fetchWidgetLinks("spectrum");
      widgetLinks = widgetLinksResp.data;
    }

    if (!success || !data) {
      setTimeout(() => {
        return this._getData();
      }, 120000);
      return success;
    }

    this.setState({
      loading: false,
      data: data as any,
      metric: {
        fcas: Math.round(data.value),
        change: data.percent_change,
        name: data.asset_name,
      },
      widgetLinks: widgetLinks,
    });
    return success;
  }

  _update() {
    this.interval = window.setInterval(async () => {
      await this._getData();
    }, 90000);
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
          change: 0,
        },
      });
    }
    this._update();
  }

  render(props: Props, state: State) {
    if (state.loading) return null;
    if (!state.data) return <NoDataMessage />;

    const { mode, rank, trend, api } = props;
    const { metric, data } = state;
    const fcas = Math.round(data.value);

    let scoreLink = find(state.widgetLinks, { name: "score_link" });
    if (!scoreLink) {
      scoreLink = {
        widget_id: "",
        name: "score_link",
        link_html: defaultFlipsideLink(api.key, "spectrum"),
      };
    }

    return (
      <div class={css[mode]}>
        {props.showHeader && (
          <div class={css.header}>
            <img
              class={css.icon}
              src={`https://d301yvow08hyfu.cloudfront.net/svg/color/${data.symbol.toLowerCase()}.svg`}
            />
            <span class={css.name}>{data.asset_name}</span>
          </div>
        )}

        {props.showHeader && (
          <div class={css.meta}>
            <span class={css.symbol}>{data.symbol}</span>
            <span class={css.fcas}>Health {fcas}</span>
            {trend.enabled && (
              <span class={css.trend}>
                <Trend pointChange={data.point_change} value={fcas} />
              </span>
            )}
            {rank.enabled && data.has_rank && (
              <a href={scoreLink.link_html}>
                <span class={css.rank}>
                  <Rank score={fcas} grade={data.grade} kind="normal" />
                </span>
              </a>
            )}
          </div>
        )}

        {props.spectrum.enabled && (
          <Plot metric={metric} {...props} symbol={data.symbol} />
        )}

        {props.disableLinks === false && (
          <CustomLinks
            widget="spectrum"
            api={props.api}
            linkBootstrap={state.widgetLinks}
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
    bootstrapHighlights: null,
  },
  disableLinks: false,
  assets: [],
  mode: "light",
  fontFamily: "inherit",
  showHeader: true,
  relatedMarkers: {
    enabled: true,
    bucketDistance: 35,
    lineDistance: 25,
    fontFamily: "inherit",
  },
  name: { enabled: true },
  spectrum: { enabled: true },
  icon: { enabled: true },
  rank: { enabled: true },
  trend: { enabled: true },
  linkBootstrap: null,
} as Props;

export default MultiSpectrum;
