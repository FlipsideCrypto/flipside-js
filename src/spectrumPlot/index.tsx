import { h, Component } from "preact";
import classNames from "classnames";
import CustomLinks from "../components/customLinks";
import Score from "./score";
import Plot from "./plot";
import "./styles.scss";
import API from "../api";

type AssetType = {
  symbol: string;
  highlights?: string[];
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
};

type State = {
  metric: any;
  loading: boolean;
};

class SpectrumPlot extends Component<Props, State> {
  static defaultProps: Props = {
    asset: {
      symbol: "btc",
      highlights: ["eth", "zec", "zrx"]
    },
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
      this.props.asset.symbol,
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
      <div>
        <Score symbol={props.asset.symbol} metric={metric} {...props} mini />
        {props.spectrum.enabled && (
          <Plot symbol={props.asset.symbol} metric={metric} {...props} mini />
        )}
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

  slideTo = (slide: number) => {
    this.setState({ currentSlide: slide });
  };

  render(props: Props, state: CarouselState) {
    let assets = [props.asset];
    if (props.assets && props.assets.length > 0) {
      assets = props.assets;
    }
    const carouselOffset = state.currentSlide * 100;
    const carouselStyle = { transform: `translateX(-${carouselOffset}%)` };

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

        <CustomLinks />

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
