import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tab } from 'semantic-ui-react';
import Header from '../../../../components/Header';
import TopProcessors from './components/TopProcessors/TopProcessors';
import StandByProcessors from './components/StandByProcessors/StandByProcessors';
import Badge from './components/Badge/Badge';

import './processors.scss';

class Processors extends Component {
  static renderBadges() {
    return (
      <div className="badges">
        <Badge title="Maximum processor pay per block" value="50.00 XOM" />
        <Badge title="Average active processor pay rate" value="100%" />
        <Badge title="Number of positive votes selected" value="0" />
        <Badge title="Number of neutral votes selected" value="0" />
        <Badge title="Number of negative votes selected" value="0" />
      </div>
    );
  }

  static renderVotes() {
    return (
      <div className="badges">
        <Badge title="Number of positive votes selected" value="0" />
        <Badge title="Number of neutral votes selected" value="0" />
        <Badge title="Number of negative votes selected" value="0" />
      </div>
    );
  }

  static topProcessors() {
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

  static standbyProcessors() {
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
      <div ref={container => { this.container = container; }} className="container processors">
        <Header className="button--green-bg" title="Processors" />
        <div className="body">
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: 'All Processors',
                render: () => <Tab.Pane>{Processors.renderBadges()}</Tab.Pane>,
              },
              {
                menuItem: 'Votes',
                render: () => <Tab.Pane>{Processors.renderVotes()}</Tab.Pane>,
              },
            ]}
          />
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: 'Top Processors',
                render: () => <Tab.Pane>{Processors.topProcessors()}</Tab.Pane>
              },
              {
                menuItem: 'Standby Processors',
                render: () => <Tab.Pane>{Processors.standbyProcessors()}</Tab.Pane>,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default connect(state => ({ ...state.default }))(Processors);
