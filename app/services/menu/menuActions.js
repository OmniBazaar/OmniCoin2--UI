import { createActions } from 'redux-actions';

const { showSettingsModal } = createActions({
  SHOW_SETTINGS_MODAL: (showSettings) => ({ showSettings }),
});

export { showSettingsModal };
