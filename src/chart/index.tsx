import { h, Component } from "preact";
import Highcharts from "highcharts/highstock";
import merge from "lodash/merge";
import API from "../api";
import { createApiSeries, createSeries } from "./helpers";
import zipObject = require("lodash/zipObject");
import { DEFAULT_HIGHCHARTS, DEFAULT_YAXIS } from "./defaults";
import CustomLinks from "../components/customLinks";

require("highcharts/modules/exporting")(Highcharts);

type ChartType = "line" | "bar";
type ChartAxis = "left" | "right";
export type ChartSeries = {
  symbol: string;
  metric: string;
  type: ChartType;
  yAxis?: ChartAxis;
  name?: string;
};

export type Props = {
  mode?: "light" | "dark";
  title?: string;
  axisTitles?: string[];
  startDate?: string;
  endDate?: string;
  colors?: string[];
  series: ChartSeries[];
  api: API;
};

class Chart extends Component<Props> {
  static defaultProps: Partial<Props> = {
    axisTitles: []
  };

  container: HTMLElement;

  async componentDidMount() {
    const { startDate, endDate, mode, colors } = this.props;
    const apiSeries = createApiSeries(this.props.series);
    const data = await this.props.api.fetchTimeseries({
      series: apiSeries,
      start_date: startDate,
      end_date: endDate
    });
    const prefixes = zipObject(data.data.columns, data.data.prefixes) as {
      [k: string]: string;
    };
    const series = createSeries(this.props.series, data.data, prefixes);
    const textColor = mode === "dark" ? "#fff" : "#000";
    const tooltipBackground =
      mode === "dark" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)";
    const gridLineColor = mode === "dark" ? "#6c6c6c" : "#a3a3a3";

    const options = merge({}, DEFAULT_HIGHCHARTS, {
      series: series,
      chart: {
        renderTo: this.container
      },
      colors: colors,
      title: {
        text: this.props.title,
        style: { color: textColor }
      },

      legend: {
        itemStyle: { color: textColor },
        itemHoverStyle: { color: textColor }
      },

      tooltip: {
        backgroundColor: tooltipBackground,
        style: {
          color: textColor
        }
      },

      rangeSelector: {
        buttonTheme: {
          states: {
            select: {
              style: {
                color: mode === "dark" ? "#fff" : "#000"
              }
            }
          }
        }
      },

      xAxis: {
        lineColor: gridLineColor,
        tickColor: gridLineColor
      },

      yAxis: [
        merge({}, DEFAULT_YAXIS, {
          gridLineColor,
          title: {
            text: this.props.axisTitles[0],
            style: { color: textColor }
          }
        }),
        merge({}, DEFAULT_YAXIS, {
          opposite: true,
          gridLineColor,
          title: {
            text: this.props.axisTitles[1],
            style: { color: textColor }
          }
        })
      ]
    });

    Highcharts.chart(options);
  }

  render() {
    return (
      <div>
        <div ref={el => (this.container = el)} />
        <CustomLinks widget="chart" api={this.props.api} />
      </div>
    );
  }
}

export default Chart;
