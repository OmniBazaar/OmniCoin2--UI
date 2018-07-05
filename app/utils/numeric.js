const FORMATTING_EXP = /\B(?=(\d{3})+(?!\d))/g;
const DECIMAL_AMOUNT = 10;

const numberWithCommas = (number) => {
  if (number) {
    const fixedNumber = Number.parseFloat(number)
      .toFixed(DECIMAL_AMOUNT)
      .toString();
    const pointSplittedNumber = Number.parseFloat(fixedNumber)
      .toString()
      .split('.');
    const firstNumeral = pointSplittedNumber[0].replace(FORMATTING_EXP, ',');

    if (!pointSplittedNumber[1]) {
      return firstNumeral;
    }

    return `${firstNumeral}.${pointSplittedNumber[1]}`;
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
