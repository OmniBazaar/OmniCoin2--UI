import React, { Component } from 'react';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { defineMessages, injectIntl } from "react-intl";
import {connect} from "react-redux";
import { ipcRenderer } from 'electron';
import open from 'open';

const messages = defineMessages({
  newVersionAvailable: {
    id: 'UpdateForcer.newVersionAvailable',
    defaultMessage: 'A new version of OmniBazaar is available. Click "Download" to receive the update. When the download is complete, open the file to launch the update installer'
  },
  install: {
    id: 'UpdateForcer.install',
    defaultMessage: 'Download'
  },
  quit: {
    id: 'UpdateForcer.quit',
    defaultMessage: 'Cancel'
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
    const { hasUpdate } = this.props.updateNotification;
    return (
      <ConfirmationModal
        onApprove={this.update}
        onCancel={this.close}
        isOpen={hasUpdate}
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
