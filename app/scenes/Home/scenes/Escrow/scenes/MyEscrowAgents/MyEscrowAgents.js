import React, { Component } from 'react';
import { Input, Icon, Button } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import AgentItem from './components/AgentItem/AgentItem';
import Pagination from '../../../../../../components/Pagination/Pagination';

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
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleApproveClick = this.handleApproveClick.bind(this);
  }

  handleSearchChange(value) {

  }

  handleClearClick() {

  }

  handleApproveClick() {

  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="escrow-agents">
        <div className="top">
          <div>
            <Input
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
          <ul style={{"list-style-type": "none"}}>
            {agents.map((agent) =>
              <li key={agent.name}>
                <AgentItem
                  name={agent.name}
                />
              </li>
            )}
          </ul>
        </div>
        <div className="bottom">
          <Pagination />
        </div>
      </div>
    )
  }
}

export default injectIntl(MyEscrowAgents);
