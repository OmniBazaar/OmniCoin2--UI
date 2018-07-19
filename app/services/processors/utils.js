import { TransactionBuilder } from 'omnibazaarjs';
import { generateKeyFromPassword } from '../blockchain/utils/wallet';

export async function voteForProcessors(voteIds, account, password) {
  const tr = new TransactionBuilder();
  tr.add_type_operation('account_update', {
    account: account.id,
    new_options: {
      votes: voteIds,
      memo_key: account.options.memo_key,
      voting_account: '1.2.5',
      num_witness: voteIds.length,
      num_committee: 0
    }
  });
  const key = generateKeyFromPassword(account.name, 'active', password);
  await tr.set_required_fees();
  await tr.add_signer(key.privKey, key.pubKey);
  await tr.broadcast();
}
