import { h, Component } from "preact";
import { sortObjectArray } from "../../utils";
import "./styles.scss";

const PLOT_WIDTH = 240;
const PLOT_SCALE = PLOT_WIDTH / 1000;
const DEFAULT_BUCKET_DISTANCE = 35;
const DEFAULT_LINE_DISTANCE = 25;

export default class Plot extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      distribution: null,
      highlights: [],
      highlightedSymbols: []
    };
  }

  async _getData() {
    const { data, success } = await this.props.api.fetchFCASDistribution();

    if (!success || !data) {
      setTimeout(() => {
        return this._getData();
      }, 2000);
      return success;
    }

    if (data && data.length > 0) {
      this.setState({
        loading: false,
        distribution: data
      });
    }
    return success;
  }

  async _getHighlights() {
    const highlights = this.getHighlights();
    const nextHighlightState = [];
    const nextHighlightedSymbolState = [];
    await Promise.all(
      highlights.map(async asset => {
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
    if (nextHighlightState.length < this.state.highlights.length) {
      return;
    }
    this.setState({
      highlights: nextHighlightState,
      highlightedSymbols: nextHighlightedSymbolState
    });
  }

  _update() {
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
        distribution: []
      });
    }
    this._update();
  }

  getHighlights() {
    let { asset, highlights } = this.props;
    asset = asset.toLowerCase();
    if (highlights && highlights.length > 0) {
      return highlights;
    }
    highlights = [];
    if (asset == "eth" || asset == "btc") {
      highlights = ["ZEC", "XRP"];
    } else {
      highlights = ["BTC"];
    }
    return highlights;
  }

  getBuckets() {
    if (this.state.highlights.length == 0) {
      return [];
    }

    let { bucketDistance } = this.props.relatedMarkers;
    if (!bucketDistance) {
      bucketDistance = DEFAULT_BUCKET_DISTANCE;
    }

    let buckets = [];
    let currentBucketIndex = 0;
    let anchorX = 0;
    let scoresToBuckets = {};
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
      // const nextDist = nextAsset
      // ? Math.abs(nextAsset.value - currentAsset.value)
      // : 1000000;

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

  getYCoords(asset, buckets, scoresToBuckets) {
    let { lineDistance } = this.props;
    if (!lineDistance) {
      lineDistance = DEFAULT_LINE_DISTANCE;
    }

    let bucketIndex = scoresToBuckets[asset.value];
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

  render(props, { loading, distribution }) {
    if (loading) return null;

    const highlightedSymbols = this.state.highlightedSymbols;
    const highlights = this.state.highlights;

    distribution = [...distribution, ...highlights];

    const xPos = `${(props.metric.fcas / 1000) * 100}%`;
    const highlightedAssets = distribution
      .filter(i => highlightedSymbols.indexOf(i.symbol) > -1)
      .filter(i => i.symbol != props.asset.toUpperCase());

    const { buckets, scoresToBuckets } = this.getBuckets();

    return (
      <svg class="fs-plot" width="100%" height="104" overflow="visible">
        <defs>
          <linearGradient id="gradient">
            <stop stop-color="#ff2600" offset="0%" />
            <stop stop-color="#ff7a18" offset="40%" />
            <stop stop-color="#8fcb89" offset="68%" />
            <stop stop-color="#30a92d" offset="92%" />
          </linearGradient>
        </defs>

        <g fill={props.mode === "dark" ? "#fff" : "#000"}>
          <circle cx="0" cy="44" r="2.5" />
          <text x="6" y="47" font-size="8">
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
          {distribution.map(i => (
            <circle cx={`${(i.value / 1000) * 100}%`} cy="58" r="2.5" />
          ))}
        </g>

        {/* Gradient Line */}
        <rect x="0" y="64" width="100%" height="6" fill="url(#gradient)" />

        {/* Line Labels */}
        <text
          y="85"
          text-anchor="middle"
          class="fs-plot__x"
          fill={props.mode === "dark" ? "#fff" : "#000"}
        >
          <tspan x="0">0</tspan>
          <tspan x="50%">500</tspan>
          <tspan x="100%">1000</tspan>
        </text>

        {highlightedAssets.map(a => {
          const xPos = `${(a.value / 1000) * 100}%`;
          let { y, toClose } = this.getYCoords(a, buckets, scoresToBuckets);
          return (
            <g fill={props.mode === "dark" ? "#fff" : "#000"}>
              <text x={xPos} y={y} text-anchor="middle" font-size="10">
                {a.symbol}
              </text>
              {toClose === false && (
                <line
                  x1={xPos}
                  y1={y + 3}
                  x2={xPos}
                  y2="60"
                  style={`stroke:rgb(${
                    props.mode === "dark" ? "255, 255, 255" : "0,0,0"
                  }); stroke-width:0.5`}
                />
              )}
            </g>
          );
        })}

        {/* Blue FCAS Marker */}
        <text class="fs-plot__blue" text-anchor="middle" font-weight="bold">
          <tspan x={xPos} y={props.mini ? 26 : 14}>
            {props.asset.toUpperCase()}
          </tspan>
          {!props.mini && (
            <tspan x={xPos} y="104">
              {props.metric.fcas}
            </tspan>
          )}
        </text>

        {/* Blue FCAS Marker Line */}
        <line
          x1={xPos}
          y1={props.mini ? 28 : 16}
          x2={xPos}
          y2={props.mini ? 60 : 92}
          style="stroke:rgb(45,87,237); stroke-width:1"
        />
      </svg>
    );
  }
}
