import { PrivateKey, } from 'omnibazaarjs/es';

function generateKeyFromPassword(accountName, role, password) {
  const seed = accountName + role + password;
  const privKey = PrivateKey.fromSeed(seed);
  const pubKey = privKey.toPublicKey().toString();
  return { privKey, pubKey };
}

export { generateKeyFromPassword };
