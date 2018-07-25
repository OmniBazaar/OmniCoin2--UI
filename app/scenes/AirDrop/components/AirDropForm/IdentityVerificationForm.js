/**
 * created by alaverdyanrafayel on 24/07/18
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Script from 'react-load-script';
import PropTypes from 'prop-types';
import { getIdentityVerificationToken } from '../../../../services/blockchain/auth/authActions';
import './style.scss';

class IdentityVerificationForm extends Component {
  state = {
    identityVerificationUiLoaded: false,
    iframeLoaded: false,
    identityVerificationToken: null
  }
  componentDidMount() {
    const { lastLoginUserName } = this.props.auth;
    this.props.authActions.getIdentityVerificationToken(lastLoginUserName);
  }
  componentWillReceiveProps(nextProps) {
    const { identityVerificationToken } = nextProps.auth;
    if (identityVerificationToken && !this.state.identityVerificationToken) {
      this.setState({ identityVerificationToken });
    }
  }

  componentDidUpdate() {
    if (this.state.identityVerificationToken && this.state.identityVerificationUiLoaded && !this.state.iframeLoaded) {
      idensic.init(
        // selector of an iframe container (see above)
        '#root',
        // configuration object (see preparation steps)
        {
          accessToken: this.state.identityVerificationToken,
          applicantDataPage: {
            enabled: true,
            fields: [
              {
                name: 'firstName',
                required: true
              },
              {
                name: 'lastName',
                required: true
              },
              {
                name: 'email',
                required: false
              }
            ]
          },
          // steps to require:
          // identity proof (passport, id card or driving license) and a selfie
          requiredDocuments: 'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE',
        },
        // function for the iframe callbacks
        (messageType, payload) => {
          // just logging the incoming messages
          console.log('[IDENSIC DEMO] Idensic message:', messageType, payload);
        }
      );
      this.setState({ iframeLoaded: true });
    }
  }

  render() {
    return (
      <Script
        url="https://test-api.sumsub.com/idensic/static/idensic.js"
        onLoad={() => { this.setState({ identityVerificationUiLoaded: true }); }}
      />
    );
  }
}

IdentityVerificationForm.propTypes = {
  authActions: PropTypes.shape({
    getIdentityVerificationToken: PropTypes.func,
  }).isRequired,
  auth: PropTypes.shape({
    lastLoginUserName: PropTypes.string,
  }).isRequired,
};

IdentityVerificationForm = withRouter(IdentityVerificationForm);

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    authActions: bindActionCreators({ getIdentityVerificationToken }, dispatch),
  })
)(IdentityVerificationForm);

