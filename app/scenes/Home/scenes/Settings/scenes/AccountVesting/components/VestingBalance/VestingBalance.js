import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import { toastr } from 'react-redux-toastr';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Table,
  Button
} from 'semantic-ui-react';

import './vesting-balance.scss';
import messages from './messages';
import { claim } from '../../../../../../../../services/accountSettings/vestingBalances/vestingBalancesActions';
import VestingTypes from '../../types';
import { TOKENS_IN_XOM } from '../../../../../../../../utils/constants';

class VestingBalance extends Component {
  handleClaim = () => {
    this.props.vestingBalancesActions.claim(this.props.vb);
  };

  render() {
    const { vb } = this.props;
    const { formatMessage } = this.props.intl;
    const loading =
      this.props.vestingBalances.claim.loading &&
      this.props.vestingBalances.claim.vestingBalance.id === vb.id;
    let cvbAsset,
      vestingPeriod,
      earned,
      secondsPerDay = 60 * 60 * 24,
      availablePercent,
      balance;
    if (vb) {
      balance = vb.balance.amount;
      earned = vb.policy[1].coin_seconds_earned;
      vestingPeriod = vb.policy[1].vesting_seconds;
      availablePercent = vestingPeriod === 0 ? 1 : earned / (vestingPeriod * balance);
    } else {
      return null;
    }

    if (!balance) {
      return null;
    }
    return (
      <Table
        className="vesting-balance"
        basic="very"
        size="large"
        celled
        collapsing
        fixed
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              <span className="blue">
                {
                  Object.values(VestingTypes).includes(vb.type) && vb.type !== VestingTypes.none ?
                  ( formatMessage(messages[vb.type]) + ' ' ) :
                  ''
                }
                {formatMessage(messages.vestingId, { id: vb.id })}
              </span>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>{formatMessage(messages.vbAmount)}</Table.Cell>
            <Table.Cell textAlign="right">
              {vb.balance.amount / TOKENS_IN_XOM} XOM
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{formatMessage(messages.percentVested)}</Table.Cell>
            <Table.Cell textAlign="right">
              {(availablePercent * 100).toFixed(2)}%
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{formatMessage(messages.availableToClaim)}</Table.Cell>
            <Table.Cell textAlign="right">
              {vb.amountAvailable / TOKENS_IN_XOM} XOM
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell
              colSpan="2"
              textAlign="right"
            >
              <Button
                content={formatMessage(messages.claim)}
                onClick={this.handleClaim}
                className="button--primary"
                loading={loading}
                disabled={vb.amountAvailable === 0}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

VestingBalance.defaultProps = {
  vb: {}
};

VestingBalance.propTypes = {
  vb: PropTypes.shape({})
};

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    vestingBalancesActions: bindActionCreators({
      claim
    }, dispatch)
  })
)(injectIntl(VestingBalance));
