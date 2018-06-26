import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import { toastr } from 'react-redux-toastr';
import { defineMessages, injectIntl } from 'react-intl';

import './account-vesting.scss';

class AccountVesting extends Component {
  render() {
    return <div/>;
  }
}

export default injectIntl(AccountVesting);
