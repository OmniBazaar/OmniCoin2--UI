import ethers from 'ethers';
import messages from "./messages";
import {TOKENS_IN_XOM, WEI_IN_ETH} from "../../../../../../../../utils/constants";
import {numericality, required, addValidator} from "redux-form-validators";


export const requiredFieldValidator = required({ message: messages.fieldRequired });
export const numericFieldValidator = numericality({ message: messages.fieldNumeric });
export const allowBlankNumericFieldValidator = numericality({
  allowBlank: true,
  message: messages.fieldNumeric
});
export const omnicoinFieldValidator = numericality({ '>=': 1 / TOKENS_IN_XOM, msg: messages.omnicoinFieldValidator });
export const bitcoinFieldValidator = numericality({ '>=': 0.00001, msg: messages.bitcoinFieldValidator });
export const ethereumFieldValidator = numericality({ '>=': 1 / WEI_IN_ETH, msg: messages.ethereumFieldValidator });
export const fiatFieldValidator = numericality({ '>=': 0.01, msg: messages.fiatFieldValidator });
export const ethereumPriceFieldValidator = numericality({ '>=': 0.000001, msg: messages.ethereumPriceFieldValidator });
export const ethAmountValidator = addValidator({
  validator: (option, value, allValues) => {
    const min = ethers.utils.parseEther(`${option.min}`);
    const max = ethers.utils.parseEther(`${option.max}`);
    let eth;
    try {
      eth = ethers.utils.parseEther(`${value}`);
    } catch (err) {
      return {
        ...messages.minimumNumericValidator,
        values: {
          value: option.min
        }
      };
    }

    if (eth.lt(min)) {
      return {
        ...messages.minimumNumericValidator,
        values: {
          value: option.min
        }
      };
    }

    if (eth.gte(max)) {
      return {
        ...messages.maximumAmountAvailable,
        values: {
          amount: option.max
        }
      };
    }
  }
});
