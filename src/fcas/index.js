import { h, Component } from "preact";
import Score from "./score";
import Plot from "./plot";
import "./styles.scss";

export default class FCAS extends Component {
  constructor() {
    super();
    this.state = { loading: true, metric: null };
  }

  async _getData() {
    const { data, success } = await this.props.api.fetchAssetMetric(
      this.props.symbol,
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

  render({ opts, api, symbol }, { metric, loading }) {
    if (loading) return null;
    return (
      <div class="fs-container">
        {opts.score && <Score symbol={symbol} metric={metric} opts={opts} />}
        {opts.plot && (
          <Plot symbol={symbol} metric={metric} api={api} opts={opts} />
        )}
      </div>
    );
  }
}
