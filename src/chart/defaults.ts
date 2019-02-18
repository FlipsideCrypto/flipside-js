export const DEFAULT_HIGHCHARTS: Highcharts.Options = {
  chart: {
    backgroundColor: "transparent",
    style: {
      fontFamily: "inherit"
    }
  },

  title: {
    text: undefined,
    align: "left",
    style: {
      fontSize: "24px"
    }
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
  },

  navigator: {
    enabled: false
  },

  scrollbar: {
    enabled: false
  },

  rangeSelector: {
    enabled: true,
    allButtonsEnabled: false,
    buttonTheme: {
      fill: "none",
      stroke: "none",
      style: {
        color: "#9B9B9B"
      },
      states: {
        select: {
          fill: "none",
          style: {
            color: "#000",
            fontWeight: "normal",
            textDecoration: "underline"
          }
        },
        disabled: {
          style: {
            color: "#9B9B9B",
            opacity: 0.5
          }
        }
      } as any
    },
    inputEnabled: false
  },

  exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        verticalAlign: "top",
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
  }
};

export const DEFAULT_YAXIS: Highcharts.YAxisOptions = {
  title: { text: undefined },
  gridLineColor: "#6c6c6c",
  labels: {
    style: { color: "#9B9B9B" }
  }
};
