const key = 'accountSettings';

class AccountSettingsStorage {
  static initPrivateData() {
    localStorage.setItem(key, JSON.stringify({
      email: '',
      firstname: '',
      lastname: '',
      website: ''
    }));
  }

  static updatePrivateData(data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static getPrivateData() {
    const data = localStorage.getItem(key);
    if (!data) {
      AccountSettingsStorage.initPrivateData();
      return JSON.parse(localStorage.getItem(key));
    }
    return JSON.parse(data);
  }
}

export default AccountSettingsStorage;
