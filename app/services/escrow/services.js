import { Apis } from 'omnibazaarjs-ws';

export const getEscrowSettings = async (username) => {
  const account = await Apis.instance().db_api().exec('get_account_by_name', [username]);
  let options = account.implicit_escrow_options;
  if (!options) {
    options = {
      positive_rating: false,
      voted_witness: false,
      active_witness: false
    }
  }

  return options;
}

export const getEscrowAgents = async (username) => {
  const account =  await Apis.instance().db_api().exec('get_account_by_name', [username]);
  if (!account) {
    throw new Error('Account not found');
  }

  if (!account.escrows) {
    return [];
  }

  return account.escrows;
}

export const getImplicitEscrows = async (userdId) => {
  return await Apis.instance().db_api().exec('get_implicit_escrows', [userdId]);
}