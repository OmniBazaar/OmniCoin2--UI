import { FetchChain } from 'omnibazaarjs/es';
import {TOKENS_IN_XOM} from "../../utils/constants";

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

export { parseEscrowTransactions };
