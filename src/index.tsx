import { h, render } from "preact";
import API from "./api";
import Table from "./table";
import Spectrum, { Props as SpectrumProps } from "./spectrum";
import MultiTable, { Props as MultiTableProps } from "./multiTable";

type MultiTableOpts = {};

export default class Flipside {
  api: API;

  constructor(apiKey: string) {
    this.api = new API(apiKey);
  }

  multiTable(el: string, opts: MultiTableProps) {
    const element = document.getElementById(el);
    render(<MultiTable {...opts} api={this.api} />, element);
  }

  spectrum(el: string, opts: SpectrumProps): void {
    const element = document.getElementById(el);
    render(<Spectrum {...opts} api={this.api} />, element);
  }

  createTable(el: string, symbol: string, opts: object) {
    const defaults = {
      dark: false
    };
    const mergedOpts = Object.assign({}, defaults, opts);

    const element = typeof el === "string" ? document.getElementById(el) : el;
    render(<Table symbol={symbol} api={this.api} {...mergedOpts} />, element);
  }

  // createFCAS(el: string, symbol: string, opts: object) {
  //   symbol = symbol.toLowerCase();
  //   const defaults = {
  //     score: true,
  //     plot: true,
  //     symbol: true,
  //     logo: true,
  //     trend: true,
  //     rank: true,
  //     header: true,
  //     dark: false
  //   };
  //   const mergedOpts = Object.assign({}, defaults, opts);

  //   const element = typeof el === "string" ? document.getElementById(el) : el;

  //   render(<FCAS symbol={symbol} api={this.api} opts={mergedOpts} />, element);
  // }
}

declare global {
  interface Window {
    Flipside: any;
  }
}

window.Flipside = Flipside;
