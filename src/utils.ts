import defaultsDeep = require("lodash/defaultsDeep");
import isArray = require("lodash/isArray");
import mergeWith = require("lodash/mergeWith");

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