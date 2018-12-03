import axios from "axios";

export default class API {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: "https://platform-api.flipsidecrypto.com/api/v1",
      params: { api_key: apiKey }
    });
  }

  async _fetch(url, params, retryCount = 0, retryMax = 100) {
    const res = await this.client.get(url, { params: params });
    if (res.status >= 200 || res.status < 300) {
      return res.data;
    }
    if (retryCount < retryMax) {
      return await this._fetch(url, params, retryCount + 1);
    } else {
      throw `Failed to fetch data from: ${url}.`;
    }
  }

  async fetchAssetMetric(symbol, metric = "FCAS", days = 7) {
    const sym = `${symbol}`.toUpperCase();
    return await this._fetch(`/assets/${sym}/metrics/${metric}`, {
      change_over: days
    });
  }

  async fetchFCASDistribution(asset) {
    return await this._fetch(`/metrics/FCAS/assets`, {
      visual_distribution: true
    });
  }
}
