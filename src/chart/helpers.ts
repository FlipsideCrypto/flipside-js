import { ChartSeries } from ".";
import { APISeriesPayload, APISeries } from "../api";
import Highcharts, { SeriesLineOptions } from "highcharts";
import zipObject from "lodash/zipObject";

/**
 * Converts an array of ChartSeries to an APISeriesPayload by grouping metric names by symbol.
 */
export function createApiSeries(chartSeries: ChartSeries[]): APISeries[] {
  const series = chartSeries.reduce(
    (acc, s) => {
      const idx = acc.findIndex(i => i.symbol === s.symbol);
      if (idx >= 0) {
        acc[idx].names = acc[idx].names.concat([s.metric]);
      } else {
        acc.push({ symbol: s.symbol, names: [s.metric] });
      }
      return acc;
    },
    [] as APISeries[]
  );
  return series;
}

/**
 * Creates a collection of Highchart.SeriesLineOptions from csv-like data returned by the API.
 */
export function createSeries(
  series: ChartSeries[],
  data: {
    columns: string[];
    prefixes: string[];
    data: any[];
  },
  prefixes: { [k: string]: string }
): SeriesLineOptions[] {
  const zippedData = data.data.map(row => {
    return zipObject(data.columns, row);
  });

  return series.map(s => {
    const data = zippedData
      .filter(r => r.symbol === s.symbol.toUpperCase())
      .map(r => [Date.parse(r.timestamp as string), r[s.metric]]);
    return {
      name: s.metric,
      yAxis: s.yAxis,
      tooltip: {
        valuePrefix: prefixes[s.metric]
      },
      marker: { symbol: "circle" },
      data
    } as SeriesLineOptions;
  });
}

function labelFormatter(name: string, prefixes: { [k: string]: string }) {
  return function() {
    return `${prefixes[name]}${this.value}`;
  };
}
