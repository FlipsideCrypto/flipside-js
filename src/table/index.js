import { h, Component } from "preact";
import "./styles.scss";

export default class Table extends Component {
  constructor() {
    super();
    this.state = { loading: true, metric: null };
  }

  render() {
    if (loading) {
      return null;
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

    return (
      <div class="fs-table">
        <table>
          <tr class="fs-table-fcas">
            <th>FCAS</th>
            <td>
              <span class="fs-table-rank fs-table-rank--a">A</span>
            </td>
            <td>
              <span class="fs-table-fcas-score">738</span>
            </td>
            <td>
              7d
              <span class={`fs-table-trend fs-table-trend--${trendDir}`}>
                <img src={trendIcon} />2
              </span>
            </td>
          </tr>
          <tr>
            <th colspan="2">User Activity</th>
            <td>781</td>
            <td>
              7d
              <span class="fs-table-trend fs-table-trend--down">
                <img src={trendIcon} />2
              </span>
            </td>
          </tr>
          <tr>
            <th colspan="2">Developer Behavior</th>
            <td>781</td>
            <td>
              7d
              <span class="fs-table-trend fs-table-trend--down">
                <img src={trendIcon} />2
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
