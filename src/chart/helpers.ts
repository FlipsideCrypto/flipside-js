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
      const idKey = s.asset_id ? "asset_id" : "symbol";
      // @ts-ignore
      const existingIdx = acc.findIndex(i => i[idKey] === s[idKey]);
      if (existingIdx >= 0) {
        acc[existingIdx].names = acc[existingIdx].names.concat([s.metric]);
      } else {
        const apiSeries: APISeries = { names: [s.metric] };
        if (idKey === "asset_id") {
          apiSeries.asset_id = s.asset_id;
        } else {
          apiSeries.symbol = s.symbol;
        }
        acc.push(apiSeries);
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
    const idKey = s.asset_id ? "asset_id" : "symbol";
    const data = zippedData
      .filter(r => r[idKey] === s[idKey])
      .map(r => [Date.parse(r.timestamp as string), r[s.metric]]);
    return {
      name: s.name || s.metric,
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
