/**
 * created by alaverdyanrafayel on 08/07/18
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Background from '../../components/Background/Background';
import AirDropForm from './components/AirDropForm/AirDropForm';

class AirDrop extends Component {
  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.isWelcomeBonusAvailable) {
      this.props.history.push('/');
    }
  }
  render() {
    return (
      <Background>
        <AirDropForm />
      </Background>
    );
  }
}


export default connect(state => ({ ...state.default }))(AirDrop);

AirDrop.propTypes = {
  auth: PropTypes.shape({
    isWelcomeBonusAvailable: PropTypes.bool
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

AirDrop.defaultProps = {
  auth: null,
  history: {}
};
