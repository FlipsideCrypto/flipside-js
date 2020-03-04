import loadJS from "load-js";
import API from "../api";
import Flipside from "..";
import template from "lodash/template";
import mapValues from "lodash/mapValues";

type Asset = {
  id?: number;
  symbol?: string;
};

type DynamicOpts = {
  widgetId: string;
  asset: Asset;
};

export default async function dynamic(api: API, el: string, opts: DynamicOpts) {
  const res = await api.fetchDynamic(opts.widgetId);
  if (!res.success) {
    throw new Error(`Flipside: dynamic widget loading failed`);
  }

  await loadJS([
    {
      url: res.data.js_url,
      allowExternal: true
    }
  ]);

  const flipside = new window.Flipside(api.key);
  const fn: any = (flipside as any)[res.data.function_name];
  if (!fn) {
    throw new Error(
      `Flipside: dynamic function name '${res.data.function_name}' doesn't exist`
    );
  }

  const config = interpolateConfig(opts.asset, res.data.function_config);
  fn.call(flipside, el, config);
}

// Replaces instances of ${asset_id} in the config with the assetId
function interpolateConfig(asset: any, config: Object): any {
  return mapValues(config, (value: any) => {
    const targetAsset =
      typeof asset == "string" ? asset : asset.id || asset.symbol;
    if (typeof value === "string") {
      const compiled = template(value);
      return compiled({ asset_id: targetAsset });
    }
    if (typeof value === "object") {
      return interpolateConfig(targetAsset, value);
    }
    return value;
  });
}
