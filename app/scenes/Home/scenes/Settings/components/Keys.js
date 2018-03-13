import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Tab } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';

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
});

const publicKey = 'as3432fas34asf34';

class Keys extends Component {
  componentDidMount() {
    this.props.change('publicKey', publicKey);
  }

  renderPublicKeyField = ({input,  meta: {asyncValidating, touched, error, warning}}) => {
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
                render: () => <Tab.Pane>importWF</Tab.Pane>,
              },
              {
                menuItem: formatMessage(messages.importFromWallet),
                render: () => <Tab.Pane>importFromWallet</Tab.Pane>,
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

export default connect(state => ({ ...state.default }))(injectIntl(Keys));
