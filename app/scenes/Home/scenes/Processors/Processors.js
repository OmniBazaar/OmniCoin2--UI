import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

import { Tab } from 'semantic-ui-react';
import Header from '../../../../components/Header';
import TopProcessors from './components/TopProcessors/TopProcessors';
import StandByProcessors from './components/StandByProcessors/StandByProcessors';

import './processors.scss';

const messages = defineMessages({
  topProcessors: {
    id: 'Processors.topProcessors',
    defaultMessage: 'Top Processors'
  },
  standbyProcessors: {
    id: "Processors.standbyProcessors",
    defaultMessage: 'Standby Processors'
  }
});

class Processors extends Component {
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
                render: () => <Tab.Pane><TopProcessors/></Tab.Pane>
              },
              {
                menuItem: formatMessage(messages.standbyProcessors),
                render: () => <Tab.Pane><StandByProcessors/></Tab.Pane>,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.default })
)(injectIntl(Processors));
