import React, { Component } from 'react';
import {Provider} from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import Root from './Root';

export default class App extends Component {

  static propTypes: {
    store: {}
  };

  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <Root/>
          <ReduxToastr/>
        </div>
      </Provider>
    );
  }
}

