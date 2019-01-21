export const compare = key => {
  return (a, b) => {
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

export const sortObjectArray = (array, key) => {
  return array.sort(compare(key));
};
