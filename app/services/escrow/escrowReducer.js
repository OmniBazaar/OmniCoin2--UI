import { handleActions, combineActions } from 'redux-actions';

import {
    loadEscrowTransactions
} from './escrowActions';

const defaultState = {
    transactions: {},
    agents: {},
    escrowSettings: {

    }
};

const reducer = handleActions({

    LOAD_ESCROW_TRANSACTIONS_DONE: (state, action) => {
        return {
            ...state,
            transactions: action.transactions
        }
    },

    LOAD_ESCROW_AGENTS_DONE: (state, action) => {
        return {
            ...state,
            agents: action.agents
        }
    }

}, defaultState);

export default reducer;

