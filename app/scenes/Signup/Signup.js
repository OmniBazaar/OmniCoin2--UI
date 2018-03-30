import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import SignupForm from './components/SignupForm/SignupForm';
import Background from '../../components/Background/Background';
import './signup.scss';
import { getAccount } from '../../services/blockchain/auth/authActions';

class Signup extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.currentUser) {
      this.props.history.push('/');
      this.props.authActions.getAccount(nextProps.auth.currentUser.username);
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
    authActions: bindActionCreators({ getAccount }, dispatch),
  }),
)(Signup);

Signup.propTypes = {
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    error: PropTypes.shape({}),
    loading: PropTypes.bool
  })
};

Signup.defaultProps = {
  auth: null
};
