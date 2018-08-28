import React, { Component } from 'react';
import { Input, Icon, Button, Loader } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import cn from 'classnames';

import AgentItem from './components/AgentItem/AgentItem';
import Pagination from '../../../../../../components/Pagination/Pagination';
import {
  loadMyEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents,
  clearEscrowAgents,
  loadEscrowAgents,
  getEscrowAgentsCount
} from '../../../../../../services/escrow/escrowActions';

import './my-escrow-agents.scss';

const messages = defineMessages({
  search: {
    id: 'MyEscrowAgents.search',
    defaultMessage: 'Search'
  },
  clear: {
    id: 'MyEscrowAgents.clear',
    defaultMessage: 'Clear'
  },
  approveChanges: {
    id: 'MyEscrowAgents.approveChanges',
    defaultMessage: 'Approve'
  },
  user: {
    id: 'MyEscrowAgents.user',
    defaultMessage: 'User'
  },
  approve: {
    id: 'MyEscrowAgents.approve',
    defaultMessage: 'Approve'
  },
  agentsApproved: {
    id: 'MyEscrowAgents.agentsApproved',
    defaultMessage: 'Agents successfully approved'
  },
  error: {
    id: 'MyEscrowAgents.error',
    defaultMessage: 'Error'
  },
  insufficientBalance: {
    id: 'MyEscrowAgents.insufficientBalance',
    defaultMessage: "There isn't enough money on your balance"
  }
});


const limit = 10;

class MyEscrowAgents extends Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = debounce(this.handleSearchChange.bind(this), 200);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleApproveClick = this.handleApproveClick.bind(this);
    this.renderAgents = this.renderAgents.bind(this);
    this.toggleSelectAgent = this.toggleSelectAgent.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.search = this.search.bind(this);
  }

  state = {
    searchTerm: '',
    totalPages: Math.ceil(this.props.escrow.agentsCount / limit),
    activePage: 1,
    isApproveChanges: false
  };

  componentWillMount() {
    this.props.escrowActions.loadEscrowAgents(
      0,
      limit,
      this.state.searchTerm
    );
    this.props.escrowActions.loadMyEscrowAgents();
    this.props.escrowActions.getEscrowAgentsCount();
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (nextProps.escrow.agentsCount !== this.props.escrow.agentsCount) {
      this.setState({
        totalPages: Math.ceil(nextProps.escrow.agentsCount / limit)
      });
    }
    if (!nextProps.escrow.updating && nextProps.escrow.updating !== this.props.escrow.updating) {
      if (!nextProps.escrow.error) {
        toastr.success(formatMessage(messages.approve), formatMessage(messages.agentsApproved));
      } else {
        let msg = nextProps.escrow.error;
        if (msg.message) {
          msg = msg.message;
        }
        const reg = /Insufficient Balance/i;
        if (msg.match(reg)) {
          msg = formatMessage(messages.insufficientBalance);
        }
        toastr.error(formatMessage(messages.error), msg);
      }
    }
    if (
      this.props.escrow.loading &&
      !nextProps.escrow.loading &&
      nextProps.escrow.error !== this.props.escrow.error
    ) {
      toastr.error(formatMessage(messages.error), nextProps.escrow.error);
    }

    if (
      this.props.escrow.myEscrowLoading &&
      !nextProps.escrow.myEscrowLoading &&
      nextProps.escrow.myEscrowError !== this.props.escrow.myEscrowError
    ) {
      toastr.error(formatMessage(messages.error), nextProps.escrow.myEscrowError);
    }
  }

  componentWillUnmount() {
    this.props.escrowActions.clearEscrowAgents();
  }

  renderAgents() {
    const { currentUser } = this.props.auth;
    return this.props.escrow.agents
      .filter(agent => agent.name !== currentUser.username)
      .map((agent) => {
        const isSelected = !!this.props.escrow.myAgents.find(item => item.id === agent.id);
        return (
          <li key={agent.name}>
            <AgentItem
              isSelected={isSelected}
              toggleSelect={() => this.toggleSelectAgent(agent)}
              name={agent.name}
              escrowFee={agent.escrowFee}
            />
          </li>
        );
      });
  }

  search(value) {
    if (this.state.searchTerm !== value) {
      this.props.escrowActions.clearEscrowAgents();
      this.setState({
        activePage: 1
      });
    }
    this.setState({
      searchTerm: value
    });
    this.props.escrowActions.loadEscrowAgents(0, limit, value);
    this.props.escrowActions.loadMyEscrowAgents();
  }

  handleSearchChange(e, data) {
    this.search(data.value);
  }

  handleClearClick() {
    this.searchInput.inputRef.value = '';
    this.search('');
  }

  handleApproveClick() {
    this.props.escrowActions.setMyEscrowAgents(this.props.escrow.myAgents);
  }

  toggleSelectAgent(agent) {
    this.setState({
      isApproveChanges: true
    });
    if (this.props.escrow.myAgents.find(item => item.id === agent.id)) {
      this.props.escrowActions.removeMyEscrowAgents([agent]);
    } else {
      this.props.escrowActions.addOrUpdateAgents([agent]);
    }
  }


  onPageChange(e, { activePage }) {
    if (activePage <= this.state.totalPages) {
      const start = limit * (activePage - 1);
      this.props.escrowActions.loadEscrowAgents(
        start,
        limit,
        this.state.searchTerm
      );
      this.setState({
        activePage
      });
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      loading,
      updating,
      myEscrowLoading
    } = this.props.escrow;
    return (
      <div className="escrow-agents">
        <div className="top">
          <div>
            <Input
              ref={el => { this.searchInput = el; }}
              icon={<Icon name="search" />}
              iconPosition="left"
              placeholder={formatMessage(messages.search)}
              className="search-input"
              onChange={this.handleSearchChange}
            />
            <Button
              content={formatMessage(messages.clear)}
              className="button--blue-text"
              onClick={this.handleClearClick}
            />
          </div>
          <Button
            disabled={!this.state.isApproveChanges}
            content={formatMessage(messages.approveChanges)}
            className={cn('button--green-bg', updating ? 'loading' : '')}
            onClick={this.handleApproveClick}
          />
        </div>
        <div className="labels">
          <span>{formatMessage(messages.user)}</span>
          <span>{formatMessage(messages.approve)}</span>
        </div>
        <div className="content">
          {loading || myEscrowLoading ?
            <Loader active inline="centered" />
            :
            <ul style={{ listStyleType: 'none' }}>
              {this.renderAgents()}
            </ul>
          }
        </div>
        <div className="bottom">
          <Pagination
            activePage={this.state.activePage}
            onPageChange={this.onPageChange}
            totalPages={this.state.totalPages}
          />
        </div>
      </div>
    );
  }
}

MyEscrowAgents.propTypes = {
  escrowActions: PropTypes.shape({
    loadEscrowAgents: PropTypes.func,
    loadMyEscrowAgents: PropTypes.func,
    getEscrowAgentsCount: PropTypes.func,
    setMyEscrowAgents: PropTypes.func,
    removeMyEscrowAgents: PropTypes.func,
    addOrUpdateAgents: PropTypes.func,
    clearEscrowAgents: PropTypes.func
  }).isRequired,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string
    })
  }).isRequired,
  escrow: PropTypes.shape({
    myAgents: PropTypes.array,
    agentsCount: PropTypes.number,
    updating: PropTypes.bool,
    loading: PropTypes.bool,
    myEscrowLoading: PropTypes.bool,
    error: PropTypes.shape({}),
    agents: PropTypes.array,
    settings: PropTypes.shape({})
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};


export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    escrowActions: bindActionCreators({
      loadMyEscrowAgents,
      addOrUpdateAgents,
      setMyEscrowAgents,
      removeMyEscrowAgents,
      clearEscrowAgents,
      loadEscrowAgents,
      getEscrowAgentsCount
    }, dispatch),
  }),
)(injectIntl(MyEscrowAgents));
