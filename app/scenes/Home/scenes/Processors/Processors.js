import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Tab } from 'semantic-ui-react';
import Header from '../../../../components/Header';
import TopProcessors from './component/TopProcessors';
import StandByProcessors from './component/StandByProcessors';

import './processors.scss';

const Badge = (props) => {
  return (
    <div className='badge'>
      <span>{props.title}</span>
      <span className='value'>{props.value}</span>
    </div>
  )
};

class Processors extends Component {

  constructor(props) {
    super(props);

    this.state = {
      panes: []
    }
  }

  _renderBadges() {
    return (
      <div className='badges'>
        <Badge title='Maximum processor pay per block' value='50.00 XOM' />
        <Badge title='Average active processor pay rate' value='100%' />
        <Badge title='Number of positive votes selected' value='0' />
        <Badge title='Number of neutral votes selected' value='0' />
        <Badge title='Number of negative votes selected' value='0' />
      </div>
    );
  }

  _renderVotes() {
    return (
      <div className='badges'>
        <Badge title='Number of positive votes selected' value='0' />
        <Badge title='Number of neutral votes selected' value='0' />
        <Badge title='Number of negative votes selected' value='0' />
      </div>
    )
  }

  _topProcessors() {
    return (
      <TopProcessors
        rowsPerPage={5}
        tableProps={{
          sortable: true,
          compact: true,
          basic: 'very',
          striped: true,
          size: 'small'
        }}
      />
    );
  }

  _standbyProcessors() {
    return (
      <StandByProcessors
        rowsPerPage={4}
        tableProps={{
          sortable: true,
          compact: true,
          basic: 'very',
          striped: true,
          size: 'small'
        }}
      />
    );
  }

  render() {
    return (
      <div ref={container => {this.container = container}} className='container processors'>
        <Header className='button--green-bg' title='Processors' />
        <div className='body'>
          <Tab className='tabs' menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: 'All Processors',
                render: () => <Tab.Pane>{this._renderBadges()}</Tab.Pane>,
              },
              {
                menuItem: 'Votes',
                render: () => <Tab.Pane>{this._renderVotes()}</Tab.Pane>,
              },
            ]}
          />
          <Tab className='tabs' menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: 'Top Processors',
                render: () => <Tab.Pane>{this._topProcessors()}</Tab.Pane>
              },
              {
                menuItem: 'Standby Processors',
                render: () => <Tab.Pane>{this._standbyProcessors()}</Tab.Pane>,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return {...state.default}
  },
)(Processors);
