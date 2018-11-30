import { h, Component } from "preact";
import "./styles.scss";

function round(value) {
  if (!value) {
    return value;
  }
  return Math.round(value * 100) / 100;
}

export default class Score extends Component {
  constructor() {
    super();
    this.state = {
      showTooltip: false
    };
    this._showTooltip = this._showTooltip.bind(this);
    this._hideTooltip = this._hideTooltip.bind(this);
  }

  _showTooltip() {
    this.setState({ showTooltip: true });
  }

  _hideTooltip() {
    this.setState({ showTooltip: false });
  }

  render({ opts, symbol, metric }, { showTooltip }) {
    let rank;
    if (metric.fcas <= 500) {
      rank = "f";
    } else if (metric.fcas <= 649) {
      rank = "c";
    } else if (metric.fcas <= 749) {
      rank = "b";
    } else if (metric.fcas <= 899) {
      rank = "a";
    } else {
      rank = "s";
    }

    let trendDir, trendIcon;
    if (metric.change < 0) {
      trendDir = "down";
      trendIcon = require("./images/icon-down.svg");
    } else if (metric.change == 0) {
      trendDir = "eq";
      trendIcon = require("./images/icon-eq.svg");
    } else {
      trendDir = "up";
      trendIcon = require("./images/icon-up.svg");
    }

    const trendDiff = Math.abs(metric.fcas * (metric.change / 100));

    return (
      <div class="fs-score">
        <header class="fs-token">
          <img
            class="fs-token__logo"
            src={`https://s3.amazonaws.com/fsc-crypto-icons/svg/color/${symbol}.svg`}
          />
          <h1 class="fs-token__name">
            {metric.name}
            {opts.symbol && <span class="fs-token__sym">{symbol}</span>}
          </h1>
        </header>

        <div class="fs-fcas">
          <h2 class="fs-fcas__header">FCAS</h2>
          <span
            class="fs-link fs-fcas__what"
            onMouseEnter={this._showTooltip}
            onMouseLeave={this._hideTooltip}
          >
            What's this?
            {showTooltip && (
              <div class="fs-tooltip">
                <div class="fs-tooltip__content">
                  <p>
                    <b>FCAS</b> is Flipside’s Crypto Asset Score, ranging from 0
                    - 1000. The score combines values from the 3 major market
                    factors to create a comparative metric across digital
                    assets.
                  </p>
                  <p>
                    Powered by{" "}
                    <a
                      target="_blank"
                      href="https://flipsidecrypto.com"
                      class="fs-link"
                    >
                      flipsidecrypto.com
                    </a>
                  </p>
                </div>
              </div>
            )}
          </span>
        </div>

        <div class="fs-data">
          <h3 class="fs-value">{metric.fcas}</h3>

          {opts.trend && (
            <div class="fs-trend">
              <div class={`fs-trend__change fs-trend__change--${trendDir}`}>
                <img class="fs-trend__icon" src={trendIcon} />{" "}
                {round(trendDiff)}
              </div>
              7d
            </div>
          )}

          {opts.rank && (
            <div class="fs-rank">
              <b class={`fs-rank__letter fs-rank__letter--${rank}`}>{rank}</b>{" "}
              Rank
            </div>
          )}
        </div>
      </div>
    );
  }
}
