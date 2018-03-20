
const parseTransactionsFromNode = (escrowObjects) => {

    let escrowTransactionsObj = {};

    let transactionCounter = 1;

    escrowObjects.forEach((escrowObject) => {
        escrowTransactionsObj = {
            ...escrowTransactionsObj,
            [counter]: {
                transactionID: transactionCounter,
                amount: escrowObject.amount,
                parties: `You, ${escrowObject.byuer}, ${escrowObject.seller}`
            }
        }
        transactionCounter++;
    });

    return escrowTransactionsObj;
}

export { parseTransactionsFromNode };