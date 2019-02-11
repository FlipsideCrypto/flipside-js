import { h, Component } from "preact";
import classNames from "classnames";
import CustomLinks from "../components/customLinks";
import Score from "./score";
import Plot from "./plot";
import "./styles.scss";
import API, { WidgetLinksLink } from "../api";

type BootstrapAssetType = {
  value: number;
  percent_change: number;
  asset_name: string;
};

type BootstrapHighlightType = {
  symbol: string;
  value: number;
};

type AssetType = {
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
  metric: any;
  loading: boolean;
};

class SpectrumPlot extends Component<Props, State> {
  interval: NodeJS.Timeout;

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
      <div>
        <Score symbol={props.asset.symbol} metric={metric} {...props} mini />
        {props.spectrum.enabled && <Plot metric={metric} {...props} />}
      </div>
    );
  }
}

type CarouselState = {
  currentSlide: number;
};

export default class Carousel extends Component<Props, CarouselState> {
  state = {
    currentSlide: 0
  };

  static defaultProps: Props = {
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
  };

  slideTo = (slide: number) => {
    this.setState({ currentSlide: slide });
  };

  render(props: Props, state: CarouselState) {
    let assets = [props.asset];
    if (props.assets.length > 0) {
      assets = props.assets;
    }
    const carouselOffset = state.currentSlide * 100;
    const carouselStyle = {
      transform: `translateX(-${carouselOffset}%)`
    };

    return (
      <div class={`fs-spectrum fs-spectrum-${props.mode}`}>
        <div class="fs-spectrum-viewport">
          <div class="fs-spectrum-carousel" style={carouselStyle}>
            {assets.map(asset => (
              <div class="fs-spectrum-carousel-item">
                <SpectrumPlot {...props} asset={asset} />
              </div>
            ))}
          </div>
        </div>

        {props.disableLinks === false && (
          <CustomLinks
            widget="spectrum"
            api={props.api}
            linkBootstrap={props.linkBootstrap}
          />
        )}

        {assets.length > 1 && (
          <div class="fs-spectrum-dots">
            {assets.map((_, i) => {
              const classes = classNames("fs-spectrum-dot", {
                "fs-spectrum-dot-active": state.currentSlide === i
              });
              return <div class={classes} onClick={() => this.slideTo(i)} />;
            })}
          </div>
        )}
      </div>
    );
  }
}
