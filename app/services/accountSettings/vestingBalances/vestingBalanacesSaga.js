import {
  put,
  call,
  takeEvery,
  all,
  select
} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { FetchChain, TransactionBuilder } from 'omnibazaarjs/es';

import {
  getVestingBalancesSucceeded,
  getVestingBalancesFailed,
  claimSucceeded,
  claimFailed
} from './vestingBalancesActions';
import { generateKeyFromPassword } from '../../blockchain/utils/wallet';
import { getAmountAvailable } from './utils';

export function* vestingBalancesSubscriber() {
  yield all([
    takeEvery('GET_VESTING_BALANCES', getVestingBalances),
    takeEvery('CLAIM', claim)
  ]);
}

function* getVestingBalances() {
  try {
    const { currentUser } = (yield select()).default.auth;
    const userAcc = yield call(FetchChain, 'getAccount', currentUser.username);
    let vbs = yield Apis.instance()
      .db_api()
      .exec('get_vesting_balances', [userAcc.get('id')]);
    vbs = vbs.map(vb => ({
      ...vb,
      amountAvailable: getAmountAvailable(vb, true)
    }));
    yield put(getVestingBalancesSucceeded(vbs));
  } catch (error) {
    console.log('ERROR', error);
    yield put(getVestingBalancesFailed(JSON.stringify(error)));
  }
}

function* claim({ payload: { vestingBalance, forceAll } }) {
  try {
    const { currentUser } = (yield select()).default.auth;
    const userAcc = yield call(FetchChain, 'getAccount', currentUser.username);
    const tr = new TransactionBuilder();

    tr.add_type_operation('vesting_balance_withdraw', {
      owner: userAcc.get('id'),
      vesting_balance: vestingBalance.id,
      amount: {
        amount: vestingBalance.amountAvailable,
        asset_id: vestingBalance.balance.asset_id
      }
    });
    const key = generateKeyFromPassword(currentUser.username, 'active', currentUser.password);
    yield tr.set_required_fees();
    yield tr.add_signer(key.privKey, key.pubKey);
    yield tr.broadcast();
    yield put(claimSucceeded());
  } catch (error) {
    console.log('ERROR ', error);
    yield put(claimFailed(JSON.stringify(error)));
  }
}
