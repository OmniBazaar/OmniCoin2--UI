function wrapRequest(func) {
  return async (...args) => {
    const res = await func(...args);
    if (res.status !== 200) {
      throw res;
    } else {
      return res.json();
    }
  };
}

function reputationOptions(from = 0, to = 10) {
  const options = [];

  for (let index = from; index < to + 1; index++) {
    const option = {
      key: index,
      value: index,
      text: index - 5
    };
    options.push(option);
  }

  return options;
}

export {
  wrapRequest,
  reputationOptions
};
