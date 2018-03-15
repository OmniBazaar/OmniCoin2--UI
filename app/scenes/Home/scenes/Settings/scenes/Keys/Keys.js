import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Tab, Form, Image } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import CheckNormal from '../../../../images/ch-box-0-norm.svg';
import CheckPreNom from '../../../../images/ch-box-1-norm.svg';

import { setRescan } from '../../../../../../services/accountSettings/accountActions';

import './keys.scss';

const iconSize = 20;

const messages = defineMessages({
  publicKey: {
    id: 'Settings.publicKey',
    defaultMessage: 'Public Key'
  },
  yourPublicKey: {
    id: 'Settings.yourPublicKey',
    defaultMessage: 'Your Public Key'
  },
  copy: {
    id: 'Settings.copy',
    defaultMessage: 'COPY'
  },
  keyCopied: {
    id: 'Settings.keyCopied',
    defaultMessage: 'Key copied!'
  },
  publicKeyNote: {
    id: 'Settings.publicKeyNote',
    defaultMessage: 'It is safe to share this key with anyone who may wish to send you OmniCoins. However, it is easier to give them your account name.!'
  },
  importWF: {
    id: 'Settings.importWF',
    defaultMessage: 'Import WF Key'
  },
  importFromWallet: {
    id: 'Settings.importFromWallet',
    defaultMessage: 'Import Keys from Wallet'
  },
  wfPrivateKey: {
    id: 'Settings.wfPrivateKey',
    defaultMessage: 'WF Private Key'
  },
  enterPrivateKey: {
    id: 'Settings.enterPrivateKey',
    defaultMessage: 'Enter Private Key'
  },
  rescanBlockchain: {
    id: 'Settings.rescanBlockchain',
    defaultMessage: 'Rescan Blockchain'
  },
  importKey: {
    id: 'Settings.importKey',
    defaultMessage: 'IMPORT KEY'
  },
  walletPath: {
    id: 'Settings.walletPath',
    defaultMessage: 'Wallet Path'
  },
  walletPassword: {
    id: 'Settings.walletPassword',
    defaultMessage: 'Wallet Password'
  },
  selectFile: {
    id: 'Settings.selectFile',
    defaultMessage: 'Select File'
  },
  enterPassword: {
    id: 'Settings.enterPassword',
    defaultMessage: 'Please enter password'
  },
  importWallet: {
    id: 'Settings.importWallet',
    defaultMessage: 'IMPORT WALLET'
  },
});

const publicKey = 'as3432fas34asf34';

class Keys extends Component {
  static onSubmitImportWF() {
    console.log('Import WF key');
  }

  static onSubmitImportWallet() {
    console.log('Submit wallet');
  }

  static selectFile() {
    console.log('Select file');
  }

  constructor(props) {
    super(props);

    this.toggleCheck = this.toggleCheck.bind(this);
  }

  componentDidMount() {
    this.props.change('publicKey', publicKey);
    this.props.change('walletPath', '...');
  }

  renderPublicKeyField = ({
    input
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className="hybrid-input">
        <input
          {...input}
          disabled
          type="text"
          className="textfield"
        />
        <CopyToClipboard text={input.value}>
          <Button
            className="copy-btn button--green address-button"
            onClick={
              () => toastr.success(formatMessage(messages.copy), formatMessage(messages.keyCopied))
            }
          >
            {formatMessage(messages.copy)}
          </Button>
        </CopyToClipboard>
      </div>
    );
  };

  toggleCheck() {
    this.props.accountSettingsActions.setRescan();
  }

  getCheckIcon() {
    return this.props.account.rescanBlockchain ? CheckNormal : CheckPreNom;
  }

  renderWalletField = ({
    input
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className="hybrid-input">
        <input
          {...input}
          type="text"
          className="textfield"
        />
        <Button
          className="copy-btn button--green address-button"
          onClick={() => Keys.selectFile()}
        >
          {formatMessage(messages.selectFile)}
        </Button>
      </div>
    );
  };

  renderPasswordField = ({
    input
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className="hybrid-input">
        <input
          {...input}
          type="password"
          className="textfield"
          placeholder={formatMessage(messages.enterPassword)}
        />
      </div>
    );
  };

  importKeyFromWallet() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <Form onSubmit={Keys.onSubmitImportWallet} className="from-wallet-container">
          <div className="form-group">
            <span>{formatMessage(messages.walletPath)}</span>
            <Field
              disabled
              type="text"
              name="walletPath"
              component={this.renderWalletField}
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.walletPassword)}</span>
            <Field
              type="text"
              name="walletPassword"
              component={this.renderPasswordField}
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="bottom-detail">
            <div className="col-1" />
            <div className="col-3">
              <Button content={formatMessage(messages.importWallet)} type="submit" className="button--primary checkbox" />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }

  importWF() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <Form onSubmit={Keys.onSubmitImportWF} className="import-wf-container">
          <div className="form-group">
            <span>{formatMessage(messages.wfPrivateKey)}</span>
            <Field
              type="text"
              name="privateKey"
              component="input"
              className="textfield"
              placeholder={formatMessage(messages.enterPrivateKey)}
            />
            <div className="col-1" />
          </div>
          <div className="form-group rescan">
            <div className="col-1" />
            <div className="col-3 checkbox">
              <div className="check-container">
                <Image src={this.getCheckIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleCheck} />
              </div>
              <div className="description-text">
                <p className="option">{formatMessage(messages.rescanBlockchain)}</p>
              </div>
            </div>
            <div className="col-1" />
          </div>
          <div className="bottom-detail">
            <div className="col-1" />
            <div className="col-3">
              <Button content={formatMessage(messages.importKey)} type="submit" className="button--primary checkbox" />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="keys-container">
        <div className="ui form keys-form-container">
          <p className="title">{formatMessage(messages.publicKey)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.yourPublicKey)}</span>
            <Field
              disabled
              type="text"
              name="publicKey"
              component={this.renderPublicKeyField}
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <div className="col-1" />
            <div className="col-3">
              <span className="note">{formatMessage(messages.publicKeyNote)}</span>
            </div>
            <div className="col-1" />
          </div>
        </div>
        <div>
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: formatMessage(messages.importWF),
                render: () => <Tab.Pane>{this.importWF()}</Tab.Pane>,
              },
              {
                menuItem: formatMessage(messages.importFromWallet),
                render: () => <Tab.Pane>{this.importKeyFromWallet()}</Tab.Pane>,
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

Keys.propTypes = {
  accountSettingsActions: PropTypes.shape({
    setRescan: PropTypes.func,
  }),
  account: PropTypes.shape({
    rescanBlockchain: PropTypes.bool,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  change: PropTypes.func,
};

Keys.defaultProps = {
  accountSettingsActions: {},
  account: {},
  intl: {},
  change: null,
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      accountSettingsActions: bindActionCreators({
        setRescan
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'keysForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(Keys));
