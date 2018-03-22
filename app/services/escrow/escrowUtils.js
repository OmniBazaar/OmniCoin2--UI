
const parseTransactionsFromNode = (escrowObjects) => {

    let escrowTransactions = [];

    let transactionCounter = 1;

    escrowObjects.forEach((escrowObject) => {
        escrowTransactions.push({
            transactionID: transactionCounter,
            amount: escrowObject.amount,
            parties: `You, ${escrowObject.byuer}, ${escrowObject.seller}`
        });
        transactionCounter++;
    });

    return escrowTransactions;
}

export { parseTransactionsFromNode };