export const DEFAULT_HIGHCHARTS: Highcharts.Options = {
  chart: {
    backgroundColor: "transparent",
    style: {
      fontFamily: "inherit"
    }
  },

  title: {
    text: undefined,
    align: "left"
  },

  colors: ["#F5A623", "#2D57ED", "#48A748", "#006093", "#5A2788"],

  tooltip: {
    split: true,
    borderWidth: 0,
    shadow: false
  },

  credits: {
    enabled: false
  },

  xAxis: {
    type: "datetime",
    crosshair: {
      color: "#9B9B9B",
      dashStyle: "Dash"
    },
    labels: { style: { color: "#9B9B9B" } },
    lineColor: "#6c6c6c",
    tickColor: "#6c6c6c"
  }
};

export const DEFAULT_YAXIS: Highcharts.YAxisOptions = {
  title: { text: undefined },
  gridLineColor: "#6c6c6c",
  labels: {
    style: { color: "#9B9B9B" }
  }
};
