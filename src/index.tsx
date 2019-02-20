import { h, render } from "preact";
import API from "./api";
import Table from "./table";
import { defaultsWithoutArrays } from "./utils";
import Spectrum, { Props as SpectrumProps } from "./spectrum";
import MultiTable, { Props as MultiTableProps } from "./multiTable";
import Score, { Props as ScoreProps } from "./score";

export default class Flipside {
  api: API;

  constructor(apiKey: string) {
    this.api = new API(apiKey);
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
