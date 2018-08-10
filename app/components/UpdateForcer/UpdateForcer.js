import React, { Component } from 'react';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { defineMessages, injectIntl } from "react-intl";
import {connect} from "react-redux";
import { ipcRenderer } from 'electron';
import open from 'open';

const messages = defineMessages({
  newVersionAvailable: {
    id: 'UpdateForcer.newVersionAvailable',
    defaultMessage: 'A new version of app is available. Please kindly install it or quit the app'
  },
  install: {
    id: 'UpdateForcer.install',
    defaultMessage: 'Install'
  },
  quit: {
    id: 'UpdateForcer.quit',
    defaultMessage: 'Quit'
  }
});

class UpdateForcer extends Component {
  close = () => {
    ipcRenderer.send('exit', null);
  };

  update = () => {
    let appName=null;
    if (process.platform === 'linux') {
      appName = 'xdg-open';
    }
    const { updateLink } = this.props.updateNotification;
    open(updateLink, appName);
    setTimeout(this.close, 1000);
  };

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <ConfirmationModal
        onApprove={this.update}
        onCancel={this.close}
        isOpen={true}
        approveText={formatMessage(messages.install)}
        cancelText={formatMessage(messages.quit)}
      >
        {formatMessage(messages.newVersionAvailable)}
      </ConfirmationModal>
    );
  }
}


export default connect(state => ({
  updateNotification: state.default.updateNotification
}))(injectIntl(UpdateForcer));
