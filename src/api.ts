import axios, { AxiosInstance, AxiosPromise } from "axios";

export default class API {
  key: string;
  client: AxiosInstance;

  constructor(apiKey: string) {
    this.key = apiKey;
    this.client = axios.create({
      baseURL: "https://platform-api.flipsidecrypto.com/api/v1",
      params: { api_key: apiKey }
    });
  }

  async _fetch(
    method: string,
    url: string,
    params = {},
    retryCount = 0,
    retryMax = 15
  ): Promise<any> {
    let res;
    try {
      res = await this.client.request({
        url,
        method,
        params: params
      });
      if (res.status >= 200 && res.status < 300) {
        return { data: res.data, success: true };
      }
    } catch (e) {
      console.log(
        `Failed to fetch data from: "${url}". \nError message: "${e}"`
      );
    }
    if (retryCount < retryMax) {
      return await this._fetch("GET", url, params, retryCount + 1);
    }
    return { data: null, success: false };
  }

  async fetchAssetMetric(symbol: string, metric: string, days = 7) {
    const sym = `${symbol}`.toUpperCase();
    return await this._fetch("GET", `/assets/${sym}/metrics/${metric}`, {
      change_over: days
    });
  }

  async fetchAssetMetrics(symbol: string) {
    const sym = `${symbol}`.toUpperCase();
    return await this._fetch("GET", `/assets/${sym}/metrics`);
  }

  async fetchFCASDistribution() {
    return await this._fetch("GET", `/metrics/FCAS/assets`, {
      visual_distribution: true
    });
  }

  async fetchMetrics(payload: {
    assets?: string[];
    exclusions?: string[];
    sort_by?: string;
    sort_desc?: boolean;
    page?: number;
    size?: number;
    metrics?: string[];
    change_over?: number;
  }) {
    return await this.client.post(`/assets/metrics`, payload);
  }

  async fetchWidgetLinks(slug: WidgetLinksSlug): Promise<WidgetLinksResponse> {
    return await this.client.get(`/widgets/${slug}/links`);
  }

  async fetchTimeseries(payload: APISeriesPayload) {
    return await this.client.post("/timeseries", payload);
  }
}

export type APISeries = {
  symbol: string;
  names: string[];
};

export type APISeriesPayload = {
  start_date: string;
  end_date: string;
  series: APISeries[];
};

export type WidgetLinksSlug =
  | "spectrum"
  | "multi-table"
  | "table"
  | "score"
  | "chart"
  | "price-multi-table";
export type WidgetLinksLink = {
  widget_id: string;
  name: string;
  link_html: string;
};
export type WidgetLinksResponse = {
  data: WidgetLinksLink[];
};
