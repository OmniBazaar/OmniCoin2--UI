import { createActions } from 'redux-actions';

const {
  getVestingBalances,
  getVestingBalancesSucceeded,
  getVestingBalancesFailed,
  claim,
  claimSucceeded,
  claimFailed
}  = createActions({
  GET_VESTING_BALANCES: () => ({ }),
  GET_VESTING_BALANCES_SUCCEEDED: (vestingBalances) => ({ vestingBalances }),
  GET_VESTING_BALANCES_FAILED: (error) => ({ error }),
  CLAIM: (vestingBalance, forceAll = false) => ({ vestingBalance, forceAll }),
  CLAIM_SUCCEEDED: () => ({ }),
  CLAIM_FAILED: (error) => ({ error })
});

export {
  getVestingBalances,
  getVestingBalancesSucceeded,
  getVestingBalancesFailed,
  claim,
  claimSucceeded,
  claimFailed
};
