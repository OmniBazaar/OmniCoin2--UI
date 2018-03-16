import { createActions } from 'redux-actions';

const {
    loadEscrowTransactions,
    loadEscrowAgents
} =
createActions({
    LOAD_ESCROW_TRANSACTIONS: (username) => ({username}),
    LOAD_ESCROW_AGENTS: (username) => ({username})
});

export {
    loadEscrowTransactions,
    loadEscrowAgents
};