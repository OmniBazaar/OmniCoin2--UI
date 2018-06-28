const FORMATTING_EXP = /\B(?=(\d{3})+(?!\d))/g;

const numberWithCommas = (number) => {
  if (number) {
    const fixedNumber = Number.parseFloat(number)
      .toFixed(4).toString();
    const pointSplittedNumber = fixedNumber.split('.');

    return Number.parseFloat(`${pointSplittedNumber[0].replace(FORMATTING_EXP, ',')}.${pointSplittedNumber[1]}`);
  }

  return '0.00';
};

const integerWithCommas = (number) => {
  if (number) {
    return Number.parseFloat(number)
      .toString()
      .replace(FORMATTING_EXP, ',');
  }

  return '0';
};

export {
  numberWithCommas,
  integerWithCommas
};
