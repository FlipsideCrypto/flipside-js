import axios from "axios";

export default class API {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: "https://platform-api.flipsidecrypto.com/api/v1",
      params: { api_key: apiKey }
    });
  }

  async _fetch(url, params = {}, retryCount = 0, retryMax = 15) {
    let res;
    try {
      res = await this.client.get(url, { params: params });
      if (res.status >= 200 && res.status < 300) {
        return { data: res.data, success: true };
      }
    } catch (e) {
      console.log(
        `Failed to fetch data from: "${url}". \nError message: "${e}"`
      );
    }
    if (retryCount < retryMax) {
      return await this._fetch(url, params, retryCount + 1);
    }
    return { data: null, success: false };
  }

  async fetchAssetMetric(symbol, metric, days = 7) {
    const sym = `${symbol}`.toUpperCase();
    return await this._fetch(`/assets/${sym}/metrics/${metric}`, {
      change_over: days
    });
  }

  async fetchAssetMetrics(symbol) {
    const sym = `${symbol}`.toUpperCase();
    return await this._fetch(`/assets/${sym}/metrics`);
  }

  async fetchFCASDistribution(asset) {
    return await this._fetch(`/metrics/FCAS/assets`, {
      visual_distribution: true
    });
  }
}
