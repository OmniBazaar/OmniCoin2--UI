import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import open from 'open';
import ConfirmationModal from '../../../../components/ConfirmationModal/ConfirmationModal';

const messages = defineMessages({
  updatesAvailable: {
    id: 'Home.updatesAvailable',
    defaultMessage: 'Updates available'
  },
  updateMessage: {
    id: 'Home.updateMessage',
    defaultMessage: 'Before the new version is installed please double check and ' +
    'close the application if is currently running'
  }
});

class UpdateNotification extends Component {
  state={confirmOpen: false};
  
  onClickUpdate = () => {
    this.setState({
      confirmOpen: false
    });
    let appName=null;
    if (process.platform === 'linux') {
      appName = 'xdg-open';
    }
    const { updateLink } = this.props.updateNotification;
    open(updateLink, appName);
  };
  
  render() {
    const { formatMessage } = this.props.intl;
    const { hasUpdate, updateLink } = this.props.updateNotification;
    
    if (hasUpdate && updateLink) {
      return (
        <div className="update-notification">
          <Button className="button--green-bg" onClick={() => this.setState({confirmOpen: true})}>
            {formatMessage(messages.updatesAvailable)}
          </Button>
          <ConfirmationModal
            onApprove={() => this.onClickUpdate()}
            onCancel={() => this.setState({confirmOpen: false})}
            isOpen={this.state.confirmOpen}
          >
            {formatMessage(messages.updateMessage)}
          </ConfirmationModal>
        </div>
      );
    }
    
    return null;
  }
}

UpdateNotification.propTypes = {
  updateNotification: PropTypes.shape({
    updateLink: PropTypes.string,
    checking: PropTypes.bool,
    hasUpdate: PropTypes.bool
  })
};

export default connect(state => ({
  updateNotification: state.default.updateNotification
}))(injectIntl(UpdateNotification));
