import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Tab } from 'semantic-ui-react';
import Header from '../../../../components/Header';
import DataTable from '../../../../components/DataTable';

import {
  getStandbyProcessors,
  getTopProcessors,
} from  '../../../../services/processors/processorsActions';

import './processors.scss';

const standbyProcessors = [
  {
    rank: 1,
    name: 'mrs_miner',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 2,
    name: 'blockchain2000',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 3,
    name: 'doe.moe',
    approval: '<0.01%',
    reliability: '78.00%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 4,
    name: 'john48',
    approval: '<0.01%',
    reliability: '11.20%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 5,
    name: 'alexprocessor',
    approval: '<0.01%',
    reliability: '11.20%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 6,
    name: 'zord-12',
    approval: '<0.01%',
    reliability: '86.01%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 7,
    name: 'cross120',
    approval: '<0.01%',
    reliability: '12.51%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 8,
    name: 'david324',
    approval: '<0.01%',
    reliability: '3.20%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 9,
    name: 'deep-blue',
    approval: '<0.01%',
    reliability: '98.5%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 10,
    name: 'gray-2423',
    approval: '<0.01%',
    reliability: '34.40%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 11,
    name: 'homer34',
    approval: '<0.01%',
    reliability: '28.5%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 12,
    name: 'smith-24',
    approval: '<0.01%',
    reliability: '44.40%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
];
const topProcessors = [
  {
    rank: 1,
    name: 'top-processor-1',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 2,
    name: 'top-processor-2',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 3,
    name: 'top-processor-3',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
];

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

  componentDidMount () {
    this.fetchProcessors();
  }

  fetchProcessors() {
    this.props.processorsActions.getStandbyProcessors(standbyProcessors);
    this.props.processorsActions.getTopProcessors(topProcessors);
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
    const { props } = this;

    return (
      <DataTable
        data={props.processors.topProcessors}
        tableProps={{
          sortable: true,
          compact: true,
          basic: 'very',
          striped: true,
          size: 'small'
        }}
        header
        rowsPerPage={5}
        columnHeader={[
          {'rank': 'Rank'},
          {'name': 'Name'},
          {'approval': 'Approval'},
          {'reliability': 'Reliability'},
          {'reputation': 'Reputation'},
          {'referralScore': 'Referral Score'},
          {'publisherScore': 'Publisher Score'},
          {'netScore': 'NetScore'},
          {'approve': 'Approve'}
        ]}
      />
    );
  }

  _standbyProcessors() {
    const { props } = this;

    return (
      <DataTable
        data={props.processors.standbyProcessors}
        tableProps={{
          sortable: true,
          compact: true,
          basic: 'very',
          striped: true,
          size: 'small'
        }}
        header
        rowsPerPage={5}
        columnHeader={[
          {'rank': 'Rank'},
          {'name': 'Name'},
          {'approval': 'Approval'},
          {'reliability': 'Reliability'},
          {'reputation': 'Reputation'},
          {'referralScore': 'Referral Score'},
          {'publisherScore': 'Publisher Score'},
          {'netScore': 'NetScore'},
          {'approve': 'Approve'}
        ]}
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
  (dispatch) => ({
    processorsActions: bindActionCreators({ getStandbyProcessors, getTopProcessors }, dispatch),
  }),
)(Processors);
