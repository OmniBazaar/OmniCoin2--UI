const privateDataKey = 'privateDataSettings';
const publisherDataKey = 'publisherKeySettings';

class AccountSettingsStorage {
  static init(key) {
    switch(key) {
      case privateDataKey:
        localStorage.
          setItem(privateDataKey, JSON.stringify({
            email: '',
            firstname: '',
            lastname: '',
            website: ''
          }));
        break;
      case publisherDataKey:
        localStorage.setItem(publisherDataKey, JSON.stringify({
          priority: 'local',
          country: '',
          city: '',
          category: '',
          name: ''
        }));
        break;
      default:
        return;
    }
  }

  static update(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static get(key) {
    const data = localStorage.getItem(key);
    if (!data) {
      AccountSettingsStorage.init(key);
      return JSON.parse(localStorage.getItem(key));
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
    const oldData = AccountSettingsStorage.get(publisherDataKey, data);
    AccountSettingsStorage.update(publisherDataKey, {
      ...oldData,
      ...data
    });
  }

  static getPublisherData() {
    return AccountSettingsStorage.get(publisherDataKey);
  }
}

export default AccountSettingsStorage;
