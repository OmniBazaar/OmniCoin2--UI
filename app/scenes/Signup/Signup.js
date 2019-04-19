import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import SignupForm from './components/SignupForm/SignupForm';
import Background from '../../components/Background/Background';
import './signup.scss';
import { getAccount } from '../../services/blockchain/auth/authActions';
import { loadLocalPreferences } from '../../services/preferences/preferencesActions';

class Signup extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      (
        nextProps.auth.lastLoginUserName !== this.props.auth.lastLoginUserName
        && nextProps.auth.lastLoginUserName
      ) || (
        nextProps.auth.currentUser !== this.props.auth.currentUser
      )
    ) {
      if (nextProps.auth.isWelcomeBonusAvailable) {
        this.props.preferencesActions.loadLocalPreferences();
        this.props.history.push('/air-drop');
      } else {
        this.props.history.push('/');
      }
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
    preferencesActions: bindActionCreators({
      loadLocalPreferences
    }, dispatch),
  }),
)(Signup);

Signup.propTypes = {
  auth: PropTypes.shape({
    isWelcomeBonusAvailable: PropTypes.bool,
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    lastLoginUserName: PropTypes.string,
    error: PropTypes.shape({}),
    loading: PropTypes.bool
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  preferencesActions: PropTypes.shape({
    loadLocalPreferences: PropTypes.func
  }).isRequired
};

Signup.defaultProps = {
  auth: null,
  history: {}
};
