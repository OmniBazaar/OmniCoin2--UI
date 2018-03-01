import {put, takeEvery} from 'redux-saga/effects';
import {ChainStore, PrivateKey, key, Aes, FetchChain} from "bitsharesjs/es";

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
    )
}

export function* login(action) {
    let username = action.payload.username;
    let password = action.payload.password;
    let callback = action.payload.callback;
    let role = "active";
    let isAuthorized = false;
    try {
        let account = yield FetchChain("getAccount", username);
        if (!account) {
            throw "Account doesn't exist";
        }
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
        yield put({type: 'LOGIN_FAILED', error: e});
    }
    callback();
}
