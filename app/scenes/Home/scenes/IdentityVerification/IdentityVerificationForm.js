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
    const { username } = this.props.auth.currentUser;
    this.props.authActions.getIdentityVerificationToken(username);
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
        '#identityVerification',
        // configuration object (see preparation steps)
        {
          accessToken: this.state.identityVerificationToken,
          excludedCountries: ['CHN', 'USA', 'UMI'],
          applicantDataPage: {
            enabled: true,
            fields: [
              {
                name: 'country',
                required: true
              },
              {
                name: 'firstName',
                required: true
              },
              {
                name: 'lastName',
                required: true
              }
            ]
          },
          // steps to require:
          // identity proof (passport, id card or driving license) and a selfie
          requiredDocuments: 'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE',
          uiConf: {
            steps: {
              IDENTITY: {
                instructions: 'NOTE: Please provide a quality photo that is well lit, in focus and has high resolution. An unsatisfactory photo is the most frequent cause of failure of this identity verification process.'
              },
              SELFIE: {
                instructions: 'NOTE: Please provide a quality photo that is well lit, in focus and has high resolution. An unsatisfactory photo is the most frequent cause of failure of this identity verification process.'
              },
              LANDING: {
                instructions: "To be invited to the OmniCoin Token Sale, agree to the conditions below and follow the steps to verify your identity."
              }
            }
          }
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
      <React.Fragment>
        <Script
          url="https://test-api.sumsub.com/idensic/static/idensic.js"
          onLoad={() => { this.setState({ identityVerificationUiLoaded: true }); }}
        />
        <div id="identityVerification" />
      </React.Fragment>
    );
  }
}

IdentityVerificationForm.propTypes = {
  authActions: PropTypes.shape({
    getIdentityVerificationToken: PropTypes.func,
  }).isRequired,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
    })
  }).isRequired,
};

IdentityVerificationForm = withRouter(IdentityVerificationForm);

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    authActions: bindActionCreators({ getIdentityVerificationToken }, dispatch),
  })
)(IdentityVerificationForm);
