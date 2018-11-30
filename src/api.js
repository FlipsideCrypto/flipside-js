import axios from "axios";

export default class API {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: "https://platform-api.flipsidecrypto.com/api/v1",
      params: { api_key: apiKey }
    });
  }

  async fetchAssetMetric(symbol, metric = "FCAS", days = 7) {
    const sym = `${symbol}`.toUpperCase();
    const res = await this.client.get(`/assets/${sym}/metrics/${metric}`, {
      params: { change_over: days }
    });
    return res.data;
  }

  async fetchFCASDistribution(asset) {
    const res = await this.client.get(`/metrics/FCAS/assets`, {
      params: { visual_distribution: true }
    });
    return res.data;
  }
}
