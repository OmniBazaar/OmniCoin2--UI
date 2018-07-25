import { getEthereumTransactions } from '../blockchain/ethereum/EthereumApi';
import { utils } from 'ethers'

class EthereumHistory {
  constructor(address) {
    this.address = address;
    this.transactions = [];
  }

  async loadTransactions() {
    const response = await getEthereumTransactions(this.address);
    this.transactions = response.result;
  }

  isIncoming(toAddress) {
    return this.address.toLowerCase() === toAddress.toLowerCase();
  }

  transactionType(toAddress) {
    return this.isIncoming(toAddress) ? "Incoming" : "Outgoing";
  }

  getHistory() {
    const formattedTransactions = this.transactions.map(transaction => {
      return {
        id: transaction.hash,
        isEther: true,
        date: (transaction.timeStamp * 1000),
        amount: utils.formatEther(transaction.value),
        blockNum: transaction.blockNumber,
        isIncoming: this.isIncoming(transaction.to),
        from: transaction.from,
        to: transaction.to,
        fromTo: this.transactionType(transaction.to),
        fee: 0,
        type: 0,
        operationType: 0,
        operations: []
      }
    });

    return formattedTransactions;
  }
}

export default EthereumHistory;
