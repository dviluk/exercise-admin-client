export function handleTableParams<T>(params: any, sort: any): T {
  const data: any = {
    ...params,
  };

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (key.endsWith('_range') && Array.isArray(value)) {
      delete data[key];
      data[key.replace('_range', '')] = params[key].join(' - ');
    }
  });

  if (Object.keys(sort).length > 0) {
    Object.keys(sort).forEach((key, index) => {
      data[`sort[${index}][column]`] = key;
      data[`sort[${index}][direction]`] = sort[key];
    });
  }

  return data;
}
