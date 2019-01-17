import { h, render } from "preact";
import FCAS from "./fcas";
import API from "./api";
import Table from "./table";

class Flipside {
  constructor(apiKey) {
    this.api = new API(apiKey);
  }

  createTable(el, symbol) {
    const element = typeof el === "string" ? document.getElementById(el) : el;
    render(<Table symbol={symbol} api={this.api} />, element);
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
      header: true,
      dark: false
    };
    const mergedOpts = Object.assign({}, defaults, opts);

    const element = typeof el === "string" ? document.getElementById(el) : el;

    render(<FCAS symbol={symbol} api={this.api} opts={mergedOpts} />, element);
  }
}

window.Flipside = Flipside;
