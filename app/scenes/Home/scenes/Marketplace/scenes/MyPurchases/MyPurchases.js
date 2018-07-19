import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import './my-purchases.scss';

import PurchasesTable from './components/PurchasesTable/PurchasesTable';
import Menu from '../../scenes/Menu/Menu';

const messages = defineMessages({
  bought: {
    id: 'MyPurchases.bought',
    defaultMessage: 'BOUGHT'
  },
  sold: {
    id: 'MyPurchases.sold',
    defaultMessage: 'SOLD'
  }
});

class MyPurchases extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="marketplace-container category-listing recent-searches">
        <div className="header">
          <Menu />
        </div>
        <Tab
          className="tabs"
          menu={{ secondary: true, pointing: true }}
          panes={[
              {
                menuItem: formatMessage(messages.bought),
                render: () => <Tab.Pane><PurchasesTable type="buy" /></Tab.Pane>
              },
              {
                menuItem: formatMessage(messages.sold),
                render: () => <Tab.Pane><PurchasesTable type="sell" /></Tab.Pane>
              }
            ]}
        />
      </div>
    );
  }
}

export default injectIntl(MyPurchases);
