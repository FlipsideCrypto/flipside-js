// ie11 polyfills
import "core-js/fn/promise";
import "core-js/fn/object/assign";

import { h, render } from "preact";
import API from "./api";
import Table from "./table";
import { defaultsWithoutArrays } from "./utils";
import Spectrum, { Props as SpectrumProps } from "./spectrum";
import MultiTable, { Props as MultiTableProps } from "./multiTable";
import Score, { Props as ScoreProps } from "./score";
import Chart, { Props as ChartProps } from "./chart";
import Axios from "axios";
import dynamic from "./dynamic";

export default class Flipside {
  api: API;

  constructor(apiKey: string) {
    this.api = new API(apiKey);
  }

  async dynamic(el: string, opts: any) {
    dynamic(this.api, el, opts);
  }

  multiTable(el: string, opts: MultiTableProps) {
    const element = document.getElementById(el);
    const props = defaultsWithoutArrays(MultiTable.defaultProps, opts);
    render(<MultiTable {...props} api={this.api} />, element);
  }

  spectrum(el: string, opts: SpectrumProps): void {
    const element = document.getElementById(el);
    const props = defaultsWithoutArrays(Spectrum.defaultProps, opts);
    render(<Spectrum {...props} api={this.api} />, element);
  }

  score(el: string, opts: ScoreProps) {
    render(<Score {...opts} api={this.api} />, document.getElementById(el));
  }

  async chart(el: string, opts: any) {
    render(<Chart {...opts} api={this.api} />, document.getElementById(el));
  }

  createTable(el: string, symbol: string, opts: object) {
    const defaults = {
      dark: false
    };
    const mergedOpts = Object.assign({}, defaults, opts);

    const element = typeof el === "string" ? document.getElementById(el) : el;
    render(<Table symbol={symbol} api={this.api} {...mergedOpts} />, element);
  }
}

declare global {
  interface Window {
    Flipside: any;
  }
}

window.Flipside = Flipside;
