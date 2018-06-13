import { getStoredCurrentUser } from '../blockchain/auth/services';

const privateDataKey = 'privateDataSettings';
const publisherDataKey = 'publisherKeySettings';

class AccountSettingsStorage {

  static update(key, data) {
    const user = getStoredCurrentUser();
    localStorage.setItem(`${key}_${user.username}`, JSON.stringify(data));
  }

  static get(key) {
    const user = getStoredCurrentUser();
    const data = localStorage.getItem(`${key}_${user.username}`);
    if (!data) {
      return {};
    }
    return JSON.parse(data);
  }

  static updatePrivateData(data) {
    AccountSettingsStorage.update(privateDataKey, data);
  }

  static getPrivateData() {
    return AccountSettingsStorage.get(privateDataKey);
  }

  static updatePublisherData(data) {
    AccountSettingsStorage.update(publisherDataKey, data);
  }

  static getPublisherData() {
    return AccountSettingsStorage.get(publisherDataKey);
  }
}

export default AccountSettingsStorage;
