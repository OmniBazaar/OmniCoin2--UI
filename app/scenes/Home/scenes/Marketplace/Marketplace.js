import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './marketplace.scss';

class Marketplace extends Component {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
                Marketplace
      </div>
    );
  }
}

Marketplace = connect((state) => ({ ...state.default }), )(Marketplace);

export default withRouter(Marketplace);
