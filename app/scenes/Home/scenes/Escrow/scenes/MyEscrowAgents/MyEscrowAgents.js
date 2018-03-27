import React, { Component } from 'react';
import { Input, Icon, Button } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { debounce, clone } from "lodash";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';

import AgentItem from './components/AgentItem/AgentItem';
import Pagination from '../../../../../../components/Pagination/Pagination';
import  {
  loadMyEscrowAgents,
  addOrUpdateAgents,
  setMyEscrowAgents,
  removeMyEscrowAgents
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

const agents = [
  {
    name: "agent1"
  },
  {
    name: "agent2"
  },
  {
    name: "agent3"
  },
  {
    name: "agent4"
  }
];

class MyEscrowAgents extends Component {

  constructor(props) {
    super(props);
    this.handleSearchChange = debounce(this.handleSearchChange.bind(this), 500);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleApproveClick = this.handleApproveClick.bind(this);
    this.renderAgents = this.renderAgents.bind(this);
    this.toggleSelectAgent = this.toggleSelectAgent.bind(this);
  }

  state = {
    isApproved: false,
    myFreezedAgents: [],
    searchTerm: ''
  };

  componentWillMount() {
    this.props.escrowActions.loadMyEscrowAgents();
  }

  componentDidMount() {
    this.setState({
      myFreezedAgents: clone(this.props.escrow.myAgents)
    });
  }

  componentWillUnmount() {
    this.props.escrowActions.setMyEscrowAgents(this.state.myFreezedAgents);
  }

  renderAgents() {
    if (this.state.searchTerm) {
      return agents.map((agent) => {
          const isSelected = !!this.props.escrow.myAgents.find(escrow => escrow.name === agent.name);
          return (
            <li key={agent.name}>
              <AgentItem
                isSelected={isSelected}
                toggleSelect={() => this.toggleSelectAgent(agent)}
                name={agent.name}
              />
            </li>
          );
        }
      )
    } else {
      return agents.filter(agent => {
        return !!this.props.escrow.myAgents.find(escrow => escrow.name === agent.name);
      }).map(agent => {
        return (
          <li key={agent.name}>
            <AgentItem
              isSelected={true}
              toggleSelect={() => this.toggleSelectAgent(agent)}
              name={agent.name}
            />
          </li>
        );
      })
    }
  }

  handleSearchChange(e, data) {
    this.setState({
      searchTerm: data.value
    });
  }

  handleClearClick() {
    this.searchInput.inputRef.value = '';
    this.setState({
      searchTerm: ''
    });
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
    if (!!this.props.escrow.myAgents.find(item => item.name === agent.name)) {
      this.props.escrowActions.removeMyEscrowAgents([agent]);
    } else {
      this.props.escrowActions.addOrUpdateAgents([agent]);
    }
    this.setState({
      isApproved: false
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="escrow-agents">
        <div className="top">
          <div>
            <Input
              ref={el => this.searchInput = el}
              icon={<Icon name="search"/>}
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
          <ul style={{listStyleType: "none"}}>
            {this.renderAgents()}
          </ul>
        </div>
        <div className="bottom">
          <Pagination />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    escrowActions: bindActionCreators({
      loadMyEscrowAgents,
      addOrUpdateAgents,
      setMyEscrowAgents,
      removeMyEscrowAgents
    }, dispatch),
  }),
)(injectIntl(MyEscrowAgents));
