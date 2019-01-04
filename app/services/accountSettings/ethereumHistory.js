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

  getFeeTransaction(toAddress, gasPrice) {
    return this.isIncoming(toAddress) ? 0 : utils.formatEther(gasPrice)
  }

  getHistory() {
    const formattedTransactions = this.transactions.map(transaction => {
      const gasPriceWei = utils.bigNumberify(transaction.gasPrice);
      const gasUsed = utils.bigNumberify(transaction.gasUsed);
      const fee = gasPriceWei.mul(gasUsed);
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
        fee: this.getFeeTransaction(transaction.to, fee),
        type: 0,
        operationType: 0,
        operations: []
      }
    });

    return formattedTransactions;
  }
}

export default EthereumHistory;
