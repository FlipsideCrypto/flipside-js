import { h, Component } from "preact";
import merge from "lodash/merge";
import API from "../api";
import { createApiSeries, createSeries } from "./helpers";
import zipObject from "lodash/zipObject";
import { DEFAULT_HIGHCHARTS, DEFAULT_YAXIS } from "./defaults";
import CustomLinks from "../components/customLinks";
import * as css from "./style.css";

let Highcharts: any;
if (!window.Highcharts) {
  Highcharts = require("highcharts/highstock");
  require("highcharts/modules/exporting")(Highcharts);
} else {
  Highcharts = window.Highcharts;
}

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
  series: ChartSeries[];
  api: API;
  exportingEnabled?: boolean;
};

class Chart extends Component<Props> {
  static defaultProps: Partial<Props> = {
    axisTitles: [],
    mode: "light",
    exportingEnabled: false
  };

  container: HTMLElement;

  async componentDidMount() {
    const {
      startDate,
      endDate,
      mode,
      api,
      series,
      title,
      ...rest
    } = this.props;

    const apiSeries = createApiSeries(series);
    const data = await api.fetchTimeseries({
      series: apiSeries,
      start_date: startDate,
      end_date: endDate
    });

    const prefixes = zipObject(data.data.columns, data.data.prefixes) as {
      [k: string]: string;
    };
    const loadedSeries = createSeries(series, data.data, prefixes);

    const textColor = mode === "dark" ? "#fff" : "#000";
    const tooltipBackground =
      mode === "dark" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)";
    const gridLineColor = mode === "dark" ? "#6c6c6c" : "#a3a3a3";

    const options = merge(
      {},
      DEFAULT_HIGHCHARTS,
      {
        series: loadedSeries,
        chart: {
          renderTo: this.container
        },
        title: {
          text: this.props.title,
          style: { color: textColor }
        },

        legend: {
          enabled: series && series.length > 1,
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
      },
      rest
    );
    if (this.props.exportingEnabled) {
      options.exporting = {
        enabled: true,
        buttons: {
          contextButton: {
            verticalAlign: "bottom",
            horizontalAlign: "right",
            x: 0,
            y: 0,

            color: "#ffffff",
            symbolFill: "#ffffff",
            theme: {
              fill: "transparent",
              cursor: "pointer",
              states: { hover: { fill: "transparent", opacity: 0.7 } }
            },
            menuItems: [
              "downloadCSV",
              "separator",
              "printChart",
              "separator",
              "downloadPNG",
              "downloadJPEG",
              "downloadPDF",
              "downloadSVG"
            ]
          }
        }
      };
    } else {
      options.exporting = { enabled: false };
    }
    Highcharts.chart(options);
  }

  render() {
    const { mode } = this.props;
    return (
      <div className={css[mode]}>
        <CustomLinks
          widget="chart"
          api={this.props.api}
          style={{ display: "block", textAlign: "right" }}
        />
        <div ref={el => (this.container = el)} />
      </div>
    );
  }
}

export default Chart;
