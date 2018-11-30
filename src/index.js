import { h, render } from "preact";
import FCAS from "./fcas";
import API from "./api";

class Flipside {
  constructor(apiKey) {
    this.api = new API(apiKey);
  }

  create(id, symbol, opts) {
    const defaults = {
      score: true,
      plot: true,
      symbol: true,
      logo: true,
      trend: true,
      rank: true
    };
    const mergedOpts = Object.assign({}, defaults, opts);
    render(
      <FCAS symbol={symbol} api={this.api} opts={mergedOpts} />,
      document.getElementById(id)
    );
  }
}

window.Flipside = Flipside;
