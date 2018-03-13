import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Tab, Form, Image } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import CheckNormal from '../../../images/ch-box-0-norm.svg';
import CheckPreNom from '../../../images/ch-box-1-norm.svg';

import {
  setRescan,
} from '../../../../../services/accountSettings/accountActions';

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
});

const publicKey = 'as3432fas34asf34';

class Keys extends Component {
  constructor(props) {
    super(props);

    this.toggleCheck = this.toggleCheck.bind(this);
  }

  componentDidMount() {
    this.props.change('publicKey', publicKey);
    this.props.change('walletPath', '...');
  }

  renderPublicKeyField = ({ input,  meta: {asyncValidating, touched, error, warning} }) => {
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

  onSubmitImportWF() {
    console.log('Import WF key');
  }

  toggleCheck() {
    this.props.accountSettingsActions.setRescan();
  }

  getCheckIcon() {
    return this.props.account.rescanBlockchain ? CheckNormal : CheckPreNom;
  }

  selectFile() {
    console.log('Select file');
  }

  renderWalletField = ({ input,  meta: {asyncValidating, touched, error, warning} }) => {
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
          onClick={() => this.selectFile()}
        >
          {formatMessage(messages.selectFile)}
        </Button>
      </div>
    );
  };

  renderPasswordField = ({ input,  meta: {asyncValidating, touched, error, warning} }) => {
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

  onSubmitImportWallet() {
    console.log('Submit wallet');
  }

  importKeyFromWallet() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <Form onSubmit={this.onSubmitImportWallet} className="from-wallet-container">
          <div className="form-group">
            <label>{formatMessage(messages.walletPath)}</label>
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
            <label>{formatMessage(messages.walletPassword)}</label>
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
              <Button content={formatMessage(messages.importKey)} type="submit" className="button--primary checkbox" />
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
        <Form onSubmit={this.onSubmitImportWF} className="import-wf-container">
          <div className="form-group">
            <label>{formatMessage(messages.wfPrivateKey)}</label>
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
            <label>{formatMessage(messages.yourPublicKey)}</label>
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

Keys = reduxForm({
  form: 'keysForm',
  destroyOnUnmount: true,
})(Keys);


Keys.propTypes = {
  accountSettingsActions: PropTypes.shape({
    setRescan: PropTypes.func,
  }),
  account: PropTypes.shape({
    rescanBlockchain: PropTypes.bool,
  })
};

Keys.defaultProps = {
  accountSettingsActions: {},
  account: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      setRescan
    }, dispatch),
  }),
)(injectIntl(Keys));
