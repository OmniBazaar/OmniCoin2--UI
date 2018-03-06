import {put, takeEvery, takeLatest, call} from 'redux-saga/effects';
import {ChainStore, PrivateKey, key, Aes, FetchChain} from "omnibazaarjs/es";
const faucetAddress = "https://faucet.bitshares.eu/onboarding";

function generateKeyFromPassword(accountName, role, password) {
    let seed = accountName + role + password;
    let privKey = PrivateKey.fromSeed(seed);
    let pubKey = privKey.toPublicKey().toString();
    return {privKey, pubKey};
}

export function* subscriber() {
    yield takeEvery(
        'LOGIN',
        login
    );
    yield takeEvery(
      'SIGNUP',
      signup
    );
    yield takeLatest(
      'ACCOUNT_LOOKUP',
      account_lookup
    );
}

export function* login(action) {
    let username = action.payload.username;
    let password = action.payload.password;
    let callback = action.payload.callback;
    let role = "active";
    let isAuthorized = false;
    try {
        let account = yield FetchChain("getAccount", username);
        let key = generateKeyFromPassword(username, role, password);
        account.getIn([role, "key_auths"]).forEach(auth => {
            if (auth.get(0) === key.pubKey) {
                isAuthorized = true;
            }
        });
        if (isAuthorized) {
            yield put({
                type: 'LOGIN_SUCCEEDED',
                user: {
                    username,
                    password,
                    key
                }
            });
        } else {
            yield put({type: 'LOGIN_FAILED', error:  "Invalid password"});
        }
    } catch(e) {
        yield put({type: 'LOGIN_FAILED', error: "Account doesn't exist"});
    }
    callback();
}

export function* signup(action) {
  let username = action.payload.username;
  let password = action.payload.password;
  let referrer = action.payload.referrer;
  let { privKey :owner_private } = generateKeyFromPassword(username, "owner", password);
  let { privKey :active_private } = generateKeyFromPassword(username, "active", password);
  try {
    let result = yield call(fetch, faucetAddress + "/api/v1/accounts", {
      method: "post",
      mode: "cors",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "account": {
          "name": username,
          "owner_key": owner_private.toPublicKey().toPublicKeyString(),
          "active_key": active_private.toPublicKey().toPublicKeyString(),
          "memo_key": active_private.toPublicKey().toPublicKeyString(),
          "referrer": referrer
        }
      })
    });
    yield put({type: 'SIGNUP_SUCCEDED', result})
  } catch(e) {
    yield put({type: 'SIGNUP_FAILED', error: e});
  }
}


export function* account_lookup(action) {
  let username = action.payload.username;
  let callback = action.payload.callback;
  try {
    let account = yield FetchChain("getAccount", username);
    yield put({type: 'ACCOUNT_LOOKUP', result: true})
  } catch (e) {
    yield put({type: 'ACCOUNT_LOOKUP', result: false})
  }

}
