import { PrivateKey, Aes } from 'omnibazaarjs/es';

function generateKeyFromPassword(accountName, role, password) {
  const seed = accountName + role + password;
  const privKey = PrivateKey.fromSeed(seed);
  const pubKey = privKey.toPublicKey().toPublicKeyString('BTS');
  return { privKey, pubKey };
}

function decodeMemo(memo, key) {
  return Aes.decrypt_with_checksum(
    key.privKey,
    key.pubKey !== memo.from ? memo.from : memo.to,
    memo.nonce,
    memo.message
  ).toString('utf-8');
}

export {
  generateKeyFromPassword,
  decodeMemo,
};
