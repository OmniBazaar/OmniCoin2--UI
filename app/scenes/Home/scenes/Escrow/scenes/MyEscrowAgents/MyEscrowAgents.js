import React, { Component } from 'react';
import { Input, Icon, Button, Loader } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { debounce, clone } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';

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
    defaultMessage: 'Approve changes'
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
  }
});


const limit = 3;

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
    isApproved: false,
    myFreezedAgents: [],
    searchTerm: '',
    totalPages: 1,
    activePage: 1
  };

  componentWillMount() {
    this.props.escrowActions.loadEscrowAgents(0, limit, this.state.searchTerm);
    this.props.escrowActions.loadMyEscrowAgents(this.props.auth.currentUser.username);
    this.props.escrowActions.getEscrowAgentsCount();
  }

  componentDidMount() {
    this.setState({
      myFreezedAgents: clone(this.props.escrow.myAgents)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.escrow.agentsCount != this.props.escrow.agentsCount) {
      this.setState({
        totalPages: Math.ceil(nextProps.escrow.agentsCount / limit)
      });
    }
  }

  componentWillUnmount() {
    this.props.escrowActions.setMyEscrowAgents(this.state.myFreezedAgents);
    this.props.escrowActions.clearEscrowAgents();
  }

  renderAgents() {
    return this.props.escrow.agents.map((agent) => {
      const isSelected = !!this.props.escrow.myAgents.find(item => item.name === agent.name);
      return (
        <li key={agent.name}>
          <AgentItem
            isSelected={isSelected}
            toggleSelect={() => this.toggleSelectAgent(agent)}
            name={agent.name}
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
  }

  handleSearchChange(e, data) {
    this.search(data.value);
  }

  handleClearClick() {
    this.searchInput.inputRef.value = '';
    this.search('');
  }

  handleApproveClick() {
    const { formatMessage } = this.props.intl;
    this.setState({
      isApproved: true,
      myFreezedAgents: clone(this.props.escrow.myAgents)
    });
    toastr.success(formatMessage(messages.approve), formatMessage(messages.agentsApproved));
  }

  toggleSelectAgent(agent) {
    if (this.props.escrow.myAgents.find(item => item.name === agent.name)) {
      this.props.escrowActions.removeMyEscrowAgents([agent]);
    } else {
      this.props.escrowActions.addOrUpdateAgents([agent]);
    }
    this.setState({
      isApproved: false
    });
  }


  onPageChange(e, { activePage }) {
    if (activePage <= this.state.totalPages) {
      const start = limit * (activePage - 1);
      this.props.escrowActions.loadEscrowAgents(start, limit, this.state.searchTerm);
      this.setState({
        activePage
      });
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { loading } = this.props.escrow;
    return (
      <div className="escrow-agents">
        <div className="top">
          <div>
            <Input
              ref={el => this.searchInput = el}
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
            content={formatMessage(messages.approveChanges)}
            className="button--green-bg"
            onClick={this.handleApproveClick}
          />
        </div>
        <div className="labels">
          <span>{formatMessage(messages.user)}</span>
          <span>{formatMessage(messages.approve)}</span>
        </div>
        <div className="content">
          {loading ?
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
