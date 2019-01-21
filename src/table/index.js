import { h, Component } from "preact";
import keyBy from "lodash/keyBy";
import "./styles.scss";

function getMetricTrend(change) {
  if (change < 0) {
    return "down";
  } else if (change == 0) {
    return "eq";
  } else {
    return "up";
  }
}

function calculateDiff(value, percent) {
  return Math.round(Math.abs(value * (percent / 100)));
}

export default class Table extends Component {
  constructor() {
    super();
    this.state = { loading: true, metrics: null };
  }

  async componentDidMount() {
    await this._getData();
  }

  async _getData() {
    const { api, symbol } = this.props;
    const metrics = ["fcas", "dev", "utility"];
    const data = await Promise.all(
      metrics.map(async metric => {
        const res = await api.fetchAssetMetric(symbol, metric, 7);
        const trend = getMetricTrend(res.data.percent_change);
        return { ...res.data, trend, metric };
      })
    );
    this.setState({
      loading: false,
      metrics: keyBy(data, "metric")
    });
  }

  onClickLearnMore() {
    const learnMoreUrl = `https://platform-api.flipsidecrypto.com/track/table-widget/${
      this.props.api.key
    }`;
    window.location.assign(learnMoreUrl);
  }

  render({ dark }, { loading, metrics }) {
    if (loading) {
      return null;
    }

    const { fcas, dev, utility } = metrics;

    let rank;
    if (fcas.value <= 500) {
      rank = "f";
    } else if (fcas.value <= 649) {
      rank = "c";
    } else if (fcas.value <= 749) {
      rank = "b";
    } else if (fcas.value <= 899) {
      rank = "a";
    } else {
      rank = "s";
    }

    let tdStyle = this.props.borderColor
      ? { borderBottom: `1px solid ${this.props.borderColor}` }
      : { borderBottom: "1px solid #737e8d" };

    return (
      <div class={`fs-table fs-table--${dark ? "dark" : "light"}`}>
        <table>
          <tr class="fs-table-fcas">
            <th style={tdStyle}>FCAS</th>
            <td style={tdStyle}>
              <span class={`fs-table-rank fs-table-rank--${rank}`}>{rank}</span>
            </td>
            <td style={tdStyle}>
              <span class="fs-table-fcas-score">{fcas.value}</span>
            </td>
            <td style={tdStyle}>
              7d
              <span class={`fs-table-trend fs-table-trend--${fcas.trend}`}>
                {calculateDiff(fcas.value, fcas.percent_change)}
              </span>
            </td>
          </tr>

          <tr>
            <th style={tdStyle} colspan="2">
              User Activity
            </th>
            <td style={tdStyle}>{utility.value}</td>
            <td style={tdStyle}>
              7d
              <span class={`fs-table-trend fs-table-trend--${utility.trend}`}>
                {calculateDiff(utility.value, utility.percent_change)}
              </span>
            </td>
          </tr>

          <tr>
            <th style={tdStyle} colspan="2">
              Developer Behavior
            </th>
            <td style={tdStyle}>{dev.value}</td>
            <td style={tdStyle}>
              7d
              <span class={`fs-table-trend fs-table-trend--${dev.trend}`}>
                {calculateDiff(dev.value, dev.percent_change)}
              </span>
            </td>
          </tr>
        </table>
        <a class="fs-table-link" onClick={this.onClickLearnMore.bind(this)}>
          Want to know more about these scores?
        </a>
      </div>
    );
  }
}
