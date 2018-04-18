const numberWithCommas = (number) => {
  if (number) {
    return number.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return '0.00';
};

export default numberWithCommas;
