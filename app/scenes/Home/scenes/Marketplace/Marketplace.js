import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import './marketplace.scss';

class Marketplace extends Component {
    logout = () => {
      localStorage.setItem('currentUser', '');
      this.props.history.push('/login');
    };

    render() {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
                Marketplace
          <Button onClick={this.logout}>Logout</Button>
        </div>
      );
    }
}

export default withRouter(Marketplace);
