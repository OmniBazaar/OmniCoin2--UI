import { FetchChain } from 'omnibazaarjs/es';
import { TOKENS_IN_XOM } from '../../utils/constants';
import {getObjectById} from "../listing/apis";
import {getStoredCurrentUser} from "../blockchain/auth/services";

async function parseEscrowTransactions(escrowObjects, username) {
  return await Promise.all(escrowObjects.map(el => Promise.all([
    FetchChain('getAccount', el.buyer),
    FetchChain('getAccount', el.seller),
    FetchChain('getAccount', el.escrow)
  ]).then(res => {
    const parties = res.filter(el => el.get('name') !== username);
    return {
      transactionID: el.id,
      listingID: el.listing_id,
      amount: el.amount.amount / TOKENS_IN_XOM,
      parties: `You, ${parties[0].get('name')}, ${parties[1].get('name')}`,
      expirationTime: new Date(el.expiration_time).getTime(),
      buyer: res[0].toJS(),
      seller: res[1].toJS(),
      escrow: res[2].toJS()
    };
  })));
}

async function parseProposals(proposals) {
  const currentUser = getStoredCurrentUser();
  const userAcc = await FetchChain('getAccount', currentUser.username);
  return await Promise.all(proposals
    .filter(el => !el.available_active_approvals.includes(userAcc.get('id')))
    .map(el => Promise.all([
    FetchChain('getAccount', el.proposed_transaction.operations[0][1].seller_account),
    FetchChain('getAccount', el.proposed_transaction.operations[0][1].buyer_account),
    FetchChain('getAccount', el.proposed_transaction.operations[0][1].fee_paying_account)
  ]).then(res => {
    return {
      id: el.id,
      seller: res[0].toJS(),
      buyer: res[1].toJS(),
      escrow: el.proposed_transaction.operations[0][1].escrow,
      feePayingAccount: res[2].toJS(),
      proposedTime: el.proposed_transaction.operations[0][1].expiration_time,
      expirationTime: el.proposed_transaction.expiration
    }
  })))
}

export { parseEscrowTransactions, parseProposals };
