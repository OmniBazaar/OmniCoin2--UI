import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Background from '../../components/Background/Background';
import LoginForm from './components/LoginForm/LoginForm';
import './login.scss';

class Login extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.currentUser) {
      this.props.history.push('/');
    }
  }


  render() {
    return (
      <Background>
        <LoginForm />
      </Background>
    );
  }
}

export default connect(
  (state) => ({ ...state.default })
)(Login);

Login.propTypes = {
  authActions: PropTypes.shape({
    getCurrentUser: PropTypes.func
  })
};

Login.defaultProps = {
  authActions: null
};
