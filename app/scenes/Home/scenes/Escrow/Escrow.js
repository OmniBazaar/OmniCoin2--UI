import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';


import MyEscrowAgents from './scenes/MyEscrowAgents/MyEscrowAgents';
import MyEscrowSettings from './scenes/MyEscrowSettings/MyEscrowSettings';
import MyEscrowTransactions from './scenes/MyEscrowTransactions/MyEscrowTransactions';
import Header from '../../../../components/Header/index';

import {
  loadEscrowTransactions,
  loadEscrowAgents,
  loadMyEscrowAgents,
  getEscrowSettings
} from '../../../../services/escrow/escrowActions';
import './escrow.scss';

const messages = defineMessages({
  escrow: {
    id: 'Escrow.escrow',
    defaultMessage: 'Escrow'
  },
  transactions: {
    id: 'Escrow.transactions',
    defaultMessage: 'My Escrow Transactions'
  },
  agents: {
    id: 'Escrow.agents',
    defaultMessage: 'My Escrow Agents'
  },
  settings: {
    id: 'Escrow.settings',
    defaultMessage: 'My Escrow Settings'
  }
});

class Escrow extends Component {

  componentDidMount() {
    const { username } = this.props.auth.currentUser;
    this.props.escrowActions.loadEscrowTransactions(username);
    this.props.escrowActions.loadMyEscrowAgents(username);
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="container escrow">
        <Header title={formatMessage(messages.escrow)} />
        <div className="body">
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
                   {
                     menuItem: formatMessage(messages.transactions),
                     render: () => (
                       <Tab.Pane>
                         <MyEscrowTransactions />
                       </Tab.Pane>
                     ),
                   },
                   {
                     menuItem: formatMessage(messages.agents),
                     render: () => (
                       <Tab.Pane>
                         <MyEscrowAgents />
                       </Tab.Pane>
                     ),
                   },
                   {
                     menuItem: formatMessage(messages.settings),
                     render: () => (
                       <Tab.Pane>
                         <MyEscrowSettings />
                       </Tab.Pane>
                     ),
                   }
                 ]}
          />
        </div>
      </div>
    );
  }
}

Escrow.propTypes = {
  escrowActions: PropTypes.shape({
    loadEscrowTransactions: PropTypes.func,
    loadMyEscrowAgents: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  })
};

Escrow.defaultProps = {
  escrowActions: {},
  intl: {}
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    escrowActions: bindActionCreators({
      loadEscrowTransactions,
      loadMyEscrowAgents,
      getEscrowSettings,
      loadEscrowAgents
    }, dispatch),
  }),
)(injectIntl(Escrow));

