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
    const data = await this.props.api.fetchAssetMetric(
      this.props.symbol,
      "FCAS"
    );

    if (!data) return;

    this.setState({
      loading: false,
      metric: {
        fcas: Math.round(data.value),
        change: data.percent_change,
        name: data.asset_name
      }
    });
  }

  _update() {
    this.interval = setInterval(async () => {
      await this._getData();
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async componentDidMount() {
    await this._getData();
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
