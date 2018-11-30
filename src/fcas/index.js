import { h, Component } from "preact";
import Score from "./score";
import Plot from "./plot";
import "./styles.scss";

export default class FCAS extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      metric: null
    };
  }

  async componentDidMount() {
    const data = await this.props.api.fetchAssetMetric(
      this.props.symbol,
      "FCAS"
    );
    this.setState({
      loading: false,
      metric: {
        fcas: Math.round(data.value),
        change: data.percent_change,
        name: data.asset_name
      }
    });
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
