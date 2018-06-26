import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import { toastr } from 'react-redux-toastr';
import { injectIntl } from 'react-intl';
import {
  Loader
} from 'semantic-ui-react';

import './account-vesting.scss';
import messages from './messages';

import VestingBalance  from './components/VestingBalance/VestingBalance';

import { getVestingBalances } from "../../../../../../services/accountSettings/vestingBalances/vestingBalancesActions";

class AccountVesting extends Component {

  componentWillMount() {
    this.props.vestingBalancesActions.getVestingBalances();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.vestingBalances.loading && !nextProps.vestingBalances.loading) {
      if (nextProps.vestingBalances.error) {
        this.errorToast(this.props.vestingBalances.error);
      }
    }
    if (this.props.vestingBalances.claim.loading && !nextProps.vestingBalances.claim.loading) {
      if (nextProps.vestingBalances.claim.error) {
        this.errorToast(this.props.vestingBalances.claim.error);
      } else {
        this.props.vestingBalancesActions.getVestingBalances();
      }
    }
  }

  successToast(message) {
    const { formatMessage } = this.props.intl;
    toastr.success(formatMessage(messages.success), message);
  }

  errorToast(message) {
    const { formatMessage } = this.props.intl;
    toastr.error(formatMessage(messages.error), message);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { loading, vestingBalances } = this.props.vestingBalances;
    if (loading || vestingBalances.length === 0) {
      return (
        <div className="account-vesting center">
          {loading && <Loader active inline/>}
          {vestingBalances.length === 0 && !loading && formatMessage(messages.noVestings)}
        </div>
      )
    } else {
      return (
        <div className="account-vesting">
          {vestingBalances.map(vb =>
              <VestingBalance
                vb={vb}
              />
          )
          }
        </div>
      )
    }
  }
}

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    vestingBalancesActions: bindActionCreators({
      getVestingBalances
    }, dispatch)
  })
)(injectIntl(AccountVesting));
