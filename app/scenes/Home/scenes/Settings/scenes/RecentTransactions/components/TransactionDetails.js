import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import dateformat from 'dateformat';
import { Button } from 'semantic-ui-react';

const messages = defineMessages({
  close: {
    id: 'Settings.close',
    defaultMessage: 'CLOSE'
  },
  operations: {
    id: 'Settings.operations',
    defaultMessage: 'Operations'
  },
  timeStamp: {
    id: 'Settings.timeStamp',
    defaultMessage: 'TimeStamp'
  },
  transaction: {
    id: 'Settings.transaction',
    defaultMessage: 'Transaction'
  },
  block: {
    id: 'Settings.block',
    defaultMessage: 'Block'
  },
  transactionDetails: {
    id: 'Settings.transactionDetails',
    defaultMessage: 'Transaction Details'
  },
  withdraw: {
    id: 'Settings.withdraw',
    defaultMessage: 'Withdraw'
  },
  deposit: {
    id: 'Settings.deposit',
    defaultMessage: 'Deposit'
  },
  amountOfAsset: {
    id: 'Settings.amountOfAsset',
    defaultMessage: 'amount of asset'
  },
  next: {
    id: 'Settings.next',
    defaultMessage: 'Next'
  },
});

class TransactionDetails extends Component {
  constructor(props) {
    super(props);

    this.closeDetails = this.closeDetails.bind(this);
  }

  closeDetails() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  renderOperations(detailSelected) {
    const { props } = this;

    if (_.isEmpty(detailSelected)) {
      return;
    }

    const { operations } = detailSelected;
    return operations.map((operation) => {
      const operationClass = classNames({
        withdraw: operation.type === 'withdraw',
        deposit: operation.type === 'deposit',
      });

      const { formatMessage } = props.intl;
      const operationTitle = operation.type === 'withdraw' ? formatMessage(messages.withdraw) : formatMessage(messages.deposit);
      const text = operation.type === 'withdraw' ? formatMessage(messages.amountOfAsset) : '';

      return (
        <div className={operationClass}>
          {operationTitle} {operation.amount} (XOM) {text}
        </div>
      );
    });
  }

  render() {
    const { props } = this;
    const { formatMessage } = this.props.intl;
    const { detailSelected } = this.props.account;
    const containerClass = classNames({
      'details-container': true,
      details: true,
      visible: props.account.showDetails,
    });
    return (
      <div className={containerClass}>
        <div className="top-detail">
          <span>{formatMessage(messages.transactionDetails)}</span>
          <Button content={formatMessage(messages.close)} onClick={this.closeDetails} className="button--transparent" />
        </div>
        <div className="info">
          <span className="main code">
            #{detailSelected ? detailSelected.id : ''}
          </span>
          <div className="top-container">
            <div className="item">
              <span>{formatMessage(messages.block)}</span>
              <span className="code primary-blue">{detailSelected.blockNum}</span>
            </div>
            <div className="item">
              <span>{formatMessage(messages.transaction)}</span>
              <span className="code">{detailSelected.trxInBlock}</span>
            </div>
          </div>
          <div className="item">
            <span>
              {formatMessage(messages.timeStamp)} <span className="time-zone">(GMT +2)</span>
            </span>
            <span className="date">{detailSelected ? dateformat(detailSelected.date, '	yyyy-mm-dd HH:MM:ss') : ''}</span>
          </div>
        </div>
        <div className="separator" />
        <div className="operations">
          <p>{formatMessage(messages.operations)}</p>
          <div>
            {this.renderOperations(detailSelected)}
          </div>
        </div>
      </div>
    );
  }
}

TransactionDetails.propTypes = {
  onClose: PropTypes.func,
  account: PropTypes.shape({
    detailSelected: {},
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

TransactionDetails.defaultProps = {
  onClose: () => {},
  account: {},
  intl: {},
};

export default connect(state => ({ ...state.default }))(injectIntl(TransactionDetails));
