import { FetchChain } from 'omnibazaarjs/es';

async function parseEscrowTransactions(escrowObjects, username) {
  return await Promise.all(escrowObjects.map(el => Promise.all([
    FetchChain('getAccount', el.buyer),
    FetchChain('getAccount', el.seller),
    FetchChain('getAccount', el.escrow)
  ]).then(res => {
    const parties = res.filter(el => el.get('name') !== username);
    return {
      transactionID: el.id,
      amount: el.amount,
      parties: `You, ${parties[0].get('name')}, ${parties[1].get('name')}`,
      expirationTime: el.expiration_time
    };
  })));
}

export { parseEscrowTransactions };
