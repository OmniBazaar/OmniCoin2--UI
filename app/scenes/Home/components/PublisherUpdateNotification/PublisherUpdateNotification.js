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
    id: 'Home.publisherUpdatesAvailable',
    defaultMessage: 'Publisher Updates'
  },
  updateMessage: {
    id: 'Home.publisherUpdateMessage',
    defaultMessage: 'New version of publisher is available, ' +
              'please read README from new package carefully before install new version'
  }
});

class PublisherUpdateNotification extends Component {
  state={confirmOpen: false};
  
  onClickUpdate = () => {
    this.setState({
      confirmOpen: false
    });
    let appName=null;
    if (process.platform === 'linux') {
      appName = 'xdg-open';
    }
    const { updateLink } = this.props.publisherUpdateNotification;
    open(updateLink, appName);
  };
  
  render() {
    const { formatMessage } = this.props.intl;
    const { hasUpdate, updateLink } = this.props.publisherUpdateNotification;
    const { publisher, ipAddress } = this.props.account;
    
    if (publisher && ipAddress && hasUpdate && updateLink) {
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

PublisherUpdateNotification.propTypes = {
  publisherUpdateNotification: PropTypes.shape({
    updateLink: PropTypes.string,
    checking: PropTypes.bool,
    hasUpdate: PropTypes.bool
  }),
  account: PropTypes.shape({
    publisher: PropTypes.bool,
    ipAddress: PropTypes.string
  })
};

export default connect(state => ({
  publisherUpdateNotification: state.default.publisherUpdateNotification,
  account: state.default.account
}))(injectIntl(PublisherUpdateNotification));
