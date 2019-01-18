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
    console.log(keyBy(data, "metric"));
    this.setState({
      loading: false,
      metrics: keyBy(data, "metric")
    });
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

    return (
      <div class={`fs-table fs-table--${dark ? "dark" : "light"}`}>
        <table>
          <tr class="fs-table-fcas">
            <th>FCAS</th>
            <td>
              <span class={`fs-table-rank fs-table-rank--${rank}`}>{rank}</span>
            </td>
            <td>
              <span class="fs-table-fcas-score">{fcas.value}</span>
            </td>
            <td>
              7d
              <span class={`fs-table-trend fs-table-trend--${fcas.trend}`}>
                {calculateDiff(fcas.value, fcas.percent_change)}
              </span>
            </td>
          </tr>

          <tr>
            <th colspan="2">User Activity</th>
            <td>{utility.value}</td>
            <td>
              7d
              <span class={`fs-table-trend fs-table-trend--${utility.trend}`}>
                {calculateDiff(utility.value, utility.percent_change)}
              </span>
            </td>
          </tr>

          <tr>
            <th colspan="2">Developer Behavior</th>
            <td>{dev.value}</td>
            <td>
              7d
              <span class={`fs-table-trend fs-table-trend--${dev.trend}`}>
                {calculateDiff(dev.value, dev.percent_change)}
              </span>
            </td>
          </tr>
        </table>
        <a class="fs-table-link" href="#">
          Want to know more about these scores?
        </a>
      </div>
    );
  }
}
