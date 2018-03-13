import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { getCurrentUser } from '../../services/blockchain/auth/authActions';
import SignupForm from './components/SignupForm/SignupForm';
import Background from '../../components/Background/Background';
import './signup.scss';

class Signup extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.currentUser) {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <Background>
        <SignupForm />
      </Background>
    );
  }
}

export default connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    authActions: bindActionCreators({ getCurrentUser }, dispatch),
  }),
)(Signup);

Signup.propTypes = {
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    error: PropTypes.shape({}),
    accountExists: PropTypes.bool,
    loading: PropTypes.bool
  })
};

Signup.defaultProps = {
  auth: null
};
