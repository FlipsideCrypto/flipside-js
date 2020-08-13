import loadJS from "load-js";
import API from "../api";
import template from "lodash/template";
import mapValues from "lodash/mapValues";

type DynamicOpts = {
  widgetId: string;
  darkMode?: boolean;
  data?: object;
};

export default async function dynamic(api: API, el: string, opts: DynamicOpts) {
  const res = await api.fetchDynamic(opts.widgetId);
  if (!res.success) {
    throw new Error(`Flipside: dynamic widget loading failed`);
  }

  await loadJS([
    {
      url: res.data.js_url,
      allowExternal: true,
    },
  ]);

  const flipside = new window.Flipside(api.key);
  const fn: any = (flipside as any)[res.data.function_name];
  if (!fn) {
    throw new Error(
      `Flipside: dynamic function name '${res.data.function_name}' doesn't exist`
    );
  }

  const config = interpolateConfig(res.data.function_config, opts.data);
  fn.call(flipside, el, { ...config, mode: opts.darkMode ? "dark" : "light" });
}

function interpolateConfig(functionConfigTemplate: Object, data: Object): any {
  const jsonConfig = JSON.stringify(functionConfigTemplate);
  const compiledTemplate = template(jsonConfig);
  const walk = (d: any): any => {
    if (typeof d === "string") {
      let n = parseInt(d);
      if (!n) return d;
      return n;
    }

    if (Array.isArray(d)) {
      return d.map((item) => {
        return walk(item);
      });
    }

    if (typeof d === "object") {
      return mapValues(d, (item: any) => {
        return walk(item);
      });
    }
    return d;
  };
  return walk(JSON.parse(compiledTemplate({ ...data })));
}
