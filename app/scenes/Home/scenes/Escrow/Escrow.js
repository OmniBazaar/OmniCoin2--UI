import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import MyEscrowAgents from './scenes/MyEscrowAgents/MyEscrowAgents';
import MyEscrowSettings from './scenes/MyEscrowSettings/MyEscrowSettings';
import MyEscrowTransactions from './scenes/MyEscrowTransactions/MyEscrowTransactions';
import MyEscrowProposals from './scenes/MyEscrowProposals/MyEscrowProposals';
import Header from '../../../../components/Header/index';

import {
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
  },
  proposals: {
    id: 'Escrow.proposals',
    defaultMessage: 'My Escrow Proposals'
  }
});

const rowsPerPage = 20;

class Escrow extends Component {
  componentDidMount() {
    const { username } = this.props.auth.currentUser;
    this.props.escrowActions.loadMyEscrowAgents(username);
    this.props.escrowActions.getEscrowSettings();
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
                         <MyEscrowTransactions
                           rowsPerPage={rowsPerPage}
                           tableProps={{
                             sortable: true,
                             compact: true,
                             basic: 'very',
                             striped: true,
                             size: 'small'
                           }}
                         />
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
                   },
                  {
                    menuItem: formatMessage(messages.proposals),
                    render: () => (
                      <Tab.Pane>
                        <MyEscrowProposals />
                      </Tab.Pane>
                    )
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
    loadMyEscrowAgents: PropTypes.func,
    getEscrowSettings: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string
    })
  }),
  escrow: PropTypes.shape({
    transactionsFiltered: PropTypes.array
  }),
};

Escrow.defaultProps = {
  escrowActions: {},
  intl: {},
  auth: {},
  escrow: {}
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    escrowActions: bindActionCreators({
      loadMyEscrowAgents,
      getEscrowSettings,
      loadEscrowAgents
    }, dispatch),
  }),
)(injectIntl(Escrow));

