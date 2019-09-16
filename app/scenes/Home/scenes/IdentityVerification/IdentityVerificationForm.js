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
import config from '../../../../config/config';
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
    const { username } = this.props.auth.currentUser;
    if (this.state.identityVerificationToken && this.state.identityVerificationUiLoaded && !this.state.iframeLoaded) {
      idensic.init(
        // selector of an iframe container (see above)
        '#identityVerification',
        // configuration object (see preparation steps)
        {
          clientId: 'OmniBazaar',
          externalUserId: username,
          accessToken: this.state.identityVerificationToken,
          excludedCountries: ['CHN', 'USA', 'UMI'],
          navConf: {
            skipWelcomeScreen: false,
            skipAgreementsScreen: false,
            skipReviewScreen: false,
            registration: "disabled"
          },
          uiConf: {
            steps: {
              APPLICANT_DATA: {
                subTitle: 'To get your account verified fill the basic information below. \n\n ###### Citizens and residents of the United States, Canada, China, Cayman Islands, Iran, Syria, Sudan, Cuba, Burma, and Côte d’Ivoire are not eligible to participate in the OmniCoin Token Sale.'
              },
              IDENTITY: {
                subTitle: "To get your account verified fill the basic information below. \n\n ###### Citizens and residents of the United States, Canada, China, Cayman Islands, Iran, Syria, Sudan, Cuba, Burma, and Côte d’Ivoire are not eligible to participate in the OmniCoin Token Sale.",
                instructions: 'NOTE: Please provide a quality photo that is well lit, in focus and has high resolution. An unsatisfactory photo is the most frequent cause of failure of this identity verification process.'
              },
              SELFIE: {
                instructions: 'NOTE: Please provide a quality photo that is well lit, in focus and has high resolution. An unsatisfactory photo is the most frequent cause of failure of this identity verification process.'
              },
              LANDING: {
                instructions: 'To be invited to the OmniCoin Token Sale, agree to the conditions below and follow the steps to verify your identity.'
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
          url={`${config.sumsub.baseUrl}/idensic/static/sumsub-kyc.js`}
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
