import { defineMessages } from 'react-intl';

import VestingTypes from '../../types';

export default defineMessages({
  success: {
    id: 'VestingBalance.success',
    defaultMessage: 'Success'
  },
  error: {
    id: 'VestingBalance.error',
    defaultMessage: 'Error'
  },
  vestingId: {
    id: 'VestingBalance.vestingId',
    defaultMessage: 'VESTING #{id}'
  },
  vbAmount: {
    id: 'VestingBalance.vbAmount',
    defaultMessage: 'Vesting balance amount'
  },
  cdEarned: {
    id: 'VestingBalance.cdEarned',
    defaultMessage: 'Coin days earned'
  },
  cdRequired: {
    id: 'VestingBalance.cdRequired',
    defaultMessage: 'Coin days required'
  },
  daysLeft: {
    id: 'VestingBalance.daysLeft',
    defaultMessage: 'Days left of vesting period'
  },
  availableToClaim: {
    id: 'VestingBalance.available',
    defaultMessage: 'Available to claim'
  },
  days: {
    id: 'VestingBalance.days',
    defaultMessage: '{number} days'
  },
  coinDays: {
    id: 'VestingBalance.coinDays',
    defaultMessage: '{number} coin days'
  },
  claim: {
    id: 'VestingBalance.claim',
    defaultMessage: 'Claim'
  },
  [VestingTypes.none]: {
    id: 'VestingBalance.none',
    defaultMessage: '\u200b'
  },
  [VestingTypes.escrowFee]: {
    id: 'VestingBalance.escrowFee',
    defaultMessage: 'ESCROW FEE'
  },
  [VestingTypes.founderFee]: {
    id: 'VestingBalance.founderFee',
    defaultMessage: 'FOUNDER FEE'
  },
  [VestingTypes.publisherFee]: {
    id: 'VestingBalance.publisherFee',
    defaultMessage: 'PUBLISHER FEE'
  },
  [VestingTypes.referrerFee]: {
    id: 'VestingBalance.referrerFee',
    defaultMessage: 'REFERRER FEE'
  }
});
