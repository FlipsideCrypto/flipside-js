import { h, Component } from "preact";
import { sortObjectArray } from "../../utils";
import classNames from "classnames";
import * as css from "./style.css";
import { score } from "../../score/style.css";

const PLOT_WIDTH = 240;
const PLOT_SCALE = PLOT_WIDTH / 1000;
const DEFAULT_BUCKET_DISTANCE = 35;
const DEFAULT_LINE_DISTANCE = 25;

// TODO: Port this component to TS
// type Props = {
//   mode: "light" | "dark"
// }

type Props = {
  mode: "light" | "dark";
  symbol: string;
  autoRefresh?: boolean;
} & any;

export default class Plot extends Component<Props, any> {
  interval: any;

  constructor() {
    super();
    this.state = {
      loading: true,
      distribution: null,
      highlights: [],
      highlightedSymbols: [],
    };
  }

  async _getData() {
    let data;
    let success;
    const fullDistribution = true
      ? this.props.asset.fullDistribution == true
      : false;
    if (!this.props.bootstrapFCASDistribution) {
      let result = await this.props.api.fetchFCASDistribution(fullDistribution);
      data = result.data;
      success = result.success;
    } else {
      data = this.props.bootstrapFCASDistribution;
      success = true;
    }

    if (!success || !data) {
      setTimeout(() => {
        return this._getData();
      }, 2000);
      return success;
    }

    if (data && data.length > 0) {
      this.setState({
        loading: false,
        distribution: data,
      });
    }
    return success;
  }

  async _getHighlights() {
    const highlights: any[] = this.getHighlights();
    let nextHighlightState = [];
    let nextHighlightedSymbolState = [];
    if (this.props.asset && this.props.asset.bootstrapHighlights) {
      nextHighlightState = this.props.asset.bootstrapHighlights;
      nextHighlightedSymbolState = this.props.asset.bootstrapHighlights.map(
        (highlight: any) => highlight.symbol
      );
    } else {
      await Promise.all(
        highlights.map(async (asset) => {
          const { data, success } = await this.props.api.fetchAssetMetric(
            asset,
            "fcas"
          );
          if (success === true && data) {
            nextHighlightState.push(data);
            nextHighlightedSymbolState.push(data.symbol);
          }
        })
      );
    }
    if (nextHighlightState.length < this.state.highlights.length) {
      return;
    }
    this.setState({
      highlights: nextHighlightState,
      highlightedSymbols: nextHighlightedSymbolState,
    });
  }

  _update() {
    if (this.props.autoRefresh !== true) {
      return;
    }
    this.interval = setInterval(() => {
      this._getData();
    }, 300000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async componentDidMount() {
    this._getHighlights();
    const success = await this._getData();
    if (!success) {
      this.setState({
        loading: false,
        distribution: [],
      });
    }
    this._update();
  }

  getHighlights() {
    let { asset } = this.props;
    let { highlights } = asset;
    let assetSymbol = this.props.symbol.toLowerCase();

    if (highlights && highlights.length > 0) {
      return highlights;
    }
    highlights = [];
    if (assetSymbol == "eth" || assetSymbol == "btc") {
      highlights = ["ZEC", "XRP"];
    } else {
      highlights = ["BTC"];
    }
    return highlights;
  }

  getBuckets(): any {
    if (this.state.highlights.length == 0) {
      return [];
    }

    let { bucketDistance } = this.props.relatedMarkers;
    if (!bucketDistance) {
      bucketDistance = DEFAULT_BUCKET_DISTANCE;
    }

    let buckets: any[] = [];
    let currentBucketIndex = 0;
    let anchorX = 0;
    let scoresToBuckets: any = {};
    let highlightLength = this.state.highlights.length;
    let sortedHighLights = sortObjectArray(this.state.highlights, "value");

    for (let i = 0; i < highlightLength; i++) {
      let currentAsset = sortedHighLights[i];
      // If first item
      if (i === 0) {
        buckets[currentBucketIndex] = [];
        buckets[currentBucketIndex].push(currentAsset);
        scoresToBuckets[currentAsset.value] = currentBucketIndex;
        anchorX = currentAsset.value;
        continue;
      }
      const nextAsset =
        i !== highlightLength - 1 ? sortedHighLights[i + 1] : null;

      const prevDist = Math.abs(anchorX - currentAsset.value);

      if (prevDist <= bucketDistance) {
        buckets[currentBucketIndex].push(currentAsset);
        scoresToBuckets[currentAsset.value] = currentBucketIndex;
      } else {
        currentBucketIndex++;
        buckets[currentBucketIndex] = [];
        buckets[currentBucketIndex].push(currentAsset);
        scoresToBuckets[currentAsset.value] = currentBucketIndex;
        anchorX = currentAsset.value;
      }
    }
    return { buckets, scoresToBuckets };
  }

  getYCoords(asset: any, buckets: any, scoresToBuckets: any) {
    let { lineDistance } = this.props.relatedMarkers;
    if (!lineDistance) {
      lineDistance = DEFAULT_LINE_DISTANCE;
    }

    let bucketIndex = scoresToBuckets[asset.value];

    if (bucketIndex == null || bucketIndex == undefined) return;
    let bucket = buckets[bucketIndex];

    let index = 0;

    let toClose = false;
    for (let i = 0; i < bucket.length; i++) {
      let ba = bucket[i];
      if (ba.symbol == asset.symbol) {
        index = i;
        if (i === 0) {
          break;
        }
        const prevAsset = bucket[i - 1];
        if (prevAsset && Math.abs(prevAsset.value - ba.value) <= lineDistance) {
          toClose = true;
        }
        break;
      }
    }

    return { y: 44 - 10 * index, toClose };
  }

  render(props: any, { loading, distribution }: any) {
    if (loading) return null;

    const highlightedSymbols = this.state.highlightedSymbols;
    const highlights = this.state.highlights;

    distribution = [...distribution, ...highlights];
    const xPos = `${(props.metric.fcas / 1000) * 100}%`;
    const dupes: any = [];
    const highlightedAssets = distribution
      .filter((i: any) => highlightedSymbols.indexOf(i.symbol) > -1)
      .filter((i: any) => i.symbol != props.symbol.toUpperCase())
      .filter((i: any) => {
        let inList = dupes.indexOf(i.symbol) == -1;
        dupes.push(i.symbol);
        return inList;
      });

    const { buckets, scoresToBuckets } = this.getBuckets();

    let relatedLabelStyle = {};
    let relatedLineStyle = {};
    if (props.relatedMarkers) {
      relatedLabelStyle = {
        fill: props.relatedMarkers.color,
        fontFamily: props.relatedMarkers.fontFamily,
      };
      relatedLineStyle = {
        stroke: props.relatedMarkers.color,
      };
    }

    // @ts-ignore
    const classes = classNames(css.wrapper, css[props.mode]);

    return (
      <svg width="100%" height="104" overflow="visible" class={classes}>
        <defs>
          <linearGradient id="gradient">
            <stop stop-color="#ff2600" offset="0%" />
            <stop stop-color="#ff7a18" offset="40%" />
            <stop stop-color="#8fcb89" offset="68%" />
            <stop stop-color="#30a92d" offset="92%" />
          </linearGradient>
        </defs>

        <g fill={props.mode === "dark" ? "#fff" : "#000"}>
          <circle cx="3" cy="44" r="2.5" />
          <text x="9" y="47" font-size="8">
            Coins
          </text>
        </g>

        {/* Distribution Dots */}
        <g
          fill={
            props.mode === "dark"
              ? "rgba(255, 255,255, 0.5)"
              : "rgba(0, 0, 0, 0.4)"
          }
        >
          {distribution.map((i: any) => (
            <circle cx={`${(i.value / 1000) * 100}%`} cy="58" r="2.5" />
          ))}
        </g>

        {/* Gradient Line */}
        <rect x="0" y="64" width="100%" height="6" fill="url(#gradient)" />

        {/* Spectrum Legend */}
        <text
          y="85"
          class={css.legend}
          fill={props.mode === "dark" ? "#fff" : "#000"}
        >
          <tspan text-anchor="start" x="0">
            0
          </tspan>
          <tspan text-anchor="middle" x="50%">
            500
          </tspan>
          <tspan text-anchor="end" x="100%">
            1000
          </tspan>
        </text>

        {props.relatedMarkers.enabled &&
          highlightedAssets.map((a: any) => {
            const xPos = `${(a.value / 1000) * 100}%`;
            let result = this.getYCoords(a, buckets, scoresToBuckets);
            if (!result) return;
            let { y, toClose } = result;
            return (
              <g class={css.related} style={relatedLabelStyle}>
                <text x={xPos} y={y} text-anchor="middle" font-size="10">
                  {a.symbol}
                </text>
                {toClose === false && (
                  <line
                    x1={xPos}
                    y1={y + 3}
                    x2={xPos}
                    y2="60"
                    class={css.relatedLine}
                    style={relatedLineStyle}
                  />
                )}
              </g>
            );
          })}

        {/* Blue FCAS Marker */}
        <text class={css.marker} text-anchor="middle" font-weight="bold">
          <tspan x={xPos} y={26}>
            {props.symbol.toUpperCase()}
          </tspan>
        </text>

        {/* Blue FCAS Marker Line */}
        <line x1={xPos} y1={28} x2={xPos} y2={60} class={css.line} />
      </svg>
    );
  }
}
