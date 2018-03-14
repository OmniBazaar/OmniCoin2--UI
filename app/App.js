import React, { Component } from 'react';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import PropTypes from 'prop-types';

import Root from './Root';

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <Root />
          <ReduxToastr />
        </div>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.shape({})
};

App.defaultProps = {
  store: {}
};

