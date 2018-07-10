import { handleActions } from 'redux-actions';
import {
	checkUpdate,
	checkUpdateFinish
} from './updateNotificationActions';

const defaultState = {
  hasUpdate: false,
  updateLink: '',
  checking: false,
  error: null,
  version: ''
};

const reducer = handleActions({
	[checkUpdate](state) {
		return {
			...state,
			checking: true,
			error: null
		};
	},
	[checkUpdateFinish](state, { payload: { hasUpdate, version, error, updateLink } }) {
		if (error) {
			return {
				...state,
				checking: false,
				error
			};
		} else {
			return {
				...state,
				hasUpdate,
				updateLink,
				version,
				checking: false
			};
		}
	}
}, defaultState);

export default reducer;