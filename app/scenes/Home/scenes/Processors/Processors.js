import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import { Tab } from 'semantic-ui-react';
import Header from '../../../../components/Header';
import TopProcessors from './components/TopProcessors/TopProcessors';
import StandByProcessors from './components/StandByProcessors/StandByProcessors';

import './processors.scss';

const messages = defineMessages({
  topProcessors: {
    id: 'Processors.topProcessors',
    defaultMessage: 'Active Processors'
  },
  standbyProcessors: {
    id: 'Processors.standbyProcessors',
    defaultMessage: 'Standby Processors'
  },
  success: {
    id: 'Processors.success',
    defaultMessage: 'Success'
  },
  voteSuccess: {
    id: 'Processors.voteSuccess',
    defaultMessage: 'You voted successfully!'
  },
  error: {
    id: 'Processors.error',
    defaultMessage: 'Error'
  }
});

class Processors extends Component {
  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (
      (this.props.processorsTop.voting
          && !nextProps.processorsTop.voting
          && !nextProps.processorsTop.error)
          ||
        (this.props.processorsStandby.voting
          && !nextProps.processorsStandby.voting
          && !nextProps.processorsStandby.error)
    ) {
      toastr.success(formatMessage(messages.success), formatMessage(messages.voteSuccess));
    }
    if (nextProps.processorsTop.error && !this.props.processorsTop.error) {
      toastr.error(formatMessage(messages.error), nextProps.processorsTop.error);
    }
    if (nextProps.processorsStandby.error && !this.props.processorsStandby.error) {
      toastr.error(formatMessage(messages.error), nextProps.processorsStandby.error);
    }
  }
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div ref={container => { this.container = container; }} className="container processors">
        <Header className="button--green-bg" title="Processors" />
        <div className="body">
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: formatMessage(messages.topProcessors),
                render: () => <Tab.Pane><TopProcessors /></Tab.Pane>
              },
              {
                menuItem: formatMessage(messages.standbyProcessors),
                render: () => <Tab.Pane><StandByProcessors /></Tab.Pane>,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
Processors.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  processorsTop: PropTypes.shape({
    voting: PropTypes.bool,
    error: PropTypes.string
  }),
  processorsStandby: PropTypes.shape({
    voting: PropTypes.bool,
    error: PropTypes.string
  })
};

Processors.defaultProps = {
  intl: {},
  processorsTop: {},
  processorsStandby: {}
};
export default connect(state => ({ ...state.default }))(injectIntl(Processors));
