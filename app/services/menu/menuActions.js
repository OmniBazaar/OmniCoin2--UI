import { createActions } from 'redux-actions';

const { showSettingsModal, showPreferencesModal } = createActions({
  SHOW_SETTINGS_MODAL: () => ({}),
  SHOW_PREFERENCES_MODAL: () => ({}),
});

export { showSettingsModal, showPreferencesModal };
