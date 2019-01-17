import { h, Component } from "preact";
import "./styles.scss";

const PLOT_WIDTH = 240;
const PLOT_SCALE = PLOT_WIDTH / 1000;

export default class Plot extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      distribution: null
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
      this.setState({ loading: false, distribution: data });
    }
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
      this.setState({ loading: false, distribution: [] });
    }
    this._update();
  }

  render({ opts, metric, symbol }, { loading, distribution }) {
    if (loading) return null;
    let highLightedAssetList = [];
    if (symbol == "eth" || symbol == "btc") {
      highLightedAssetList = ["ZEC", "XRP"];
    } else {
      highLightedAssetList = ["BTC"];
    }

    const xPos = `${(metric.fcas / 1000) * 100}%`;
    const highlightedAssets = distribution
      .filter(i => highLightedAssetList.indexOf(i.symbol) > -1)
      .filter(i => i.symbol != symbol.toUpperCase());

    let lastHighlightX, lastHighlightY;

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

        <g fill={opts.dark ? "#fff" : "#000"}>
          <circle cx="0" cy="44" r="2.5" />
          <text x="6" y="47" font-size="8">
            Coins
          </text>
        </g>

        {/* Distribution Dots */}
        <g fill={opts.dark ? "rgba(255, 255,255, 0.5)" : "rgba(0, 0, 0, 0.4)"}>
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
          fill={opts.dark ? "#fff" : "#000"}
        >
          <tspan x="0">0</tspan>
          <tspan x="50%">500</tspan>
          <tspan x="100%">1000</tspan>
        </text>

        {highlightedAssets.map(a => {
          let yOffset = 0;
          const xPos = `${(a.value / 1000) * 100}%`;
          if (lastHighlightX && xPos - lastHighlightX < 10) {
            yOffset = 10;
          }
          lastHighlightX = xPos;
          return (
            <g fill={opts.dark ? "#fff" : "#000"}>
              <text
                x={xPos}
                y={44 - yOffset}
                text-anchor="middle"
                font-size="10"
              >
                {a.symbol}
              </text>
              <line
                x1={xPos}
                y1={47 - yOffset}
                x2={xPos}
                y2="60"
                style={`stroke:rgb(${
                  opts.dark ? "255, 255, 255" : "0,0,0"
                }); stroke-width:0.5`}
              />
            </g>
          );
        })}

        {/* Blue FCAS Marker */}
        <text class="fs-plot__blue" text-anchor="middle">
          <tspan x={xPos} y={opts.mini ? 44 : 14}>
            {symbol.toUpperCase()}
          </tspan>
          {!opts.mini && (
            <tspan x={xPos} y="104">
              {metric.fcas}
            </tspan>
          )}
        </text>

        {/* Blue FCAS Marker Line */}
        <line
          x1={xPos}
          y1={opts.mini ? 46 : 16}
          x2={xPos}
          y2={opts.mini ? 60 : 92}
          style="stroke:rgb(45,87,237); stroke-width:1"
        />
      </svg>
    );
  }
}
