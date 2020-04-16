import isArray from "lodash/isArray";
import mergeWith from "lodash/mergeWith";

export const compare = (key: string) => {
  return (a: any, b: any) => {
    const valueA = a[key];
    const valueB = b[key];
    let comparison = 0;
    if (valueA > valueB) {
      comparison = 1;
    } else if (valueA < valueB) {
      comparison = -1;
    }
    return comparison;
  };
};

export const sortObjectArray = (array: any[], key: string) => {
  return array.sort(compare(key));
};

export function defaultsWithoutArrays(obj: object, src: object): object {
  return mergeWith({}, obj, src, (objVal, srcVal) => {
    return isArray(srcVal) ? srcVal : undefined;
  });
}

export function defaultFlipsideLink(apiKey: string, widget: string) {
  return `https://platform-api-elixir.flipsidecrypto.com/track/${widget}/${apiKey}?redirect_url=https://flipsidecrypto.com/go-beyond-price?utm_medium=widget&utm_campaign=${widget}_widget&utm_content=letter_grade`;
}

export function countDecimals(value: number) {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
}
