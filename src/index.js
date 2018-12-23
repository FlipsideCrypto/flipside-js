import { h, render } from "preact";
import FCAS from "./fcas";
import API from "./api";

class Flipside {
  constructor(apiKey) {
    this.api = new API(apiKey);
  }

  createFCAS(el, symbol, opts) {
    symbol = symbol.toLowerCase();
    const defaults = {
      score: true,
      plot: true,
      symbol: true,
      logo: true,
      trend: true,
      rank: true,
      dark: false
    };
    const mergedOpts = Object.assign({}, defaults, opts);

    const element = typeof el === "string" ? document.getElementById(el) : el;

    render(<FCAS symbol={symbol} api={this.api} opts={mergedOpts} />, element);
  }
}

window.Flipside = Flipside;
