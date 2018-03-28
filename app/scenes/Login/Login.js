import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import Background from '../../components/Background/Background';
import LoginForm from './components/LoginForm/LoginForm';
import './login.scss';
import { accountLookup } from '../../services/blockchain/auth/authActions';


class Login extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.currentUser) {
      this.props.history.push('/');
      this.props.authActions.accountLookup(nextProps.auth.currentUser.username);
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
  (state) => ({ ...state.default }),
  (dispatch) => ({
    authActions: bindActionCreators({ accountLookup }, dispatch),
  })
)(Login);

Login.propTypes = {
  authActions: PropTypes.shape({
    getCurrentUser: PropTypes.func
  })
};

Login.defaultProps = {
  authActions: null
};
