import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../../../services/blockchain/auth/authActions';

import './marketplace.scss';

class Marketplace extends Component {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
                Marketplace
        <Button onClick={this.props.authActions.logout}>Logout</Button>
      </div>
    );
  }
}

Marketplace = connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    authActions: bindActionCreators({ logout }, dispatch)
  }),
)(Marketplace);

export default withRouter(Marketplace);
