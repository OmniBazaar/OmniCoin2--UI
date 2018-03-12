import {
  put,
  takeEvery,
  takeLatest,
  call
} from 'redux-saga/effects';
import {
  PrivateKey,
  FetchChain,
} from "omnibazaarjs/es";

const faucetAddress = "http://35.171.116.3:80";

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
    let roles = ["active", "owner"];
    let isAuthorized = false;
    try {
        let account = yield call(FetchChain, "getAccount", username);
        let key = generateKeyFromPassword(username, roles[0], password);
        roles.forEach(role => {
          account.getIn([role, "key_auths"]).forEach(auth => {
            if (auth.get(0) === key.privKey.toPublicKey().toPublicKeyString('BTS')) {
              isAuthorized = true;
            }
          });
        });
        if (isAuthorized) {
            yield put({
                type: 'LOGIN_SUCCEEDED',
                user: {
                    username,
                    password
                }
            });
        } else {
            yield put({type: 'LOGIN_FAILED', error:  "Invalid password"});
        }
    } catch(e) {
      console.log("ERROR ", e);
      yield put({type: 'LOGIN_FAILED', error: "Account doesn't exist"});
    }
}

export function* signup(action) {
  let username = action.payload.username;
  let password = action.payload.password;
  let referrer = action.payload.referrer;
  let ownerKey = generateKeyFromPassword(username, "owner", password);
  let activeKey = generateKeyFromPassword(username, "active", password);
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
          "owner_key": ownerKey.privKey.toPublicKey().toPublicKeyString("BTS"),
          "active_key": activeKey.privKey.toPublicKey().toPublicKeyString("BTS"),
          "memo_key": activeKey.privKey.toPublicKey().toPublicKeyString("BTS"),
          "referrer": referrer,
          "harddrive_id": localStorage.getItem("hardDriveId"),
          "mac_address": localStorage.getItem("macAddress")
        }
      })
    });
    let resJson = yield call([result, 'json']);
    if (result.status === 201) {
      yield put({
        type: 'SIGNUP_SUCCEEDED',
        user: {
          username,
          password
        }
      });
    } else {
      const error = resJson.error;
      console.log("ERROR", error);
      let e = error.base && error.base.length && error.base.length > 0 ? error.base[0] : JSON.stringify(error);
      yield put({type: 'SIGNUP_FAILED', error: e});
    }
  } catch(e) {
    console.log("ERROR", e);
    yield put({type: 'SIGNUP_FAILED', error: e});
  }
}


export function* account_lookup(action) {
  let username = action.payload.username;
  try {
    let account = yield FetchChain("getAccount", username);
    yield put({type: 'ACCOUNT_LOOKUP_SUCCEEDED', result: true})
  } catch (e) {
    yield put({type: 'ACCOUNT_LOOKUP_SUCCEEDED', result: false})
  }

}
