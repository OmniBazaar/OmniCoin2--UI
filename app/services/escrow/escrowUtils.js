
const parseTransactionsFromNode = (escrowObjects) => {
  const escrowTransactions = [];

  escrowObjects.forEach((escrowObject) => {
    escrowTransactions.push({
      transactionID: escrowObject.id,
      amount: escrowObject.amount,
      parties: `You, ${escrowObject.buyer}, ${escrowObject.seller}`
    });
  });

  return escrowTransactions;
};

export { parseTransactionsFromNode };
