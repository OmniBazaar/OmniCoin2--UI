const numberWithCommas = (number) => {
  if (number) {
    return number.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return '0.00';
};

const integerWithCommas = (number) => {
  if (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return '0';
};

export {
  numberWithCommas,
  integerWithCommas
};
