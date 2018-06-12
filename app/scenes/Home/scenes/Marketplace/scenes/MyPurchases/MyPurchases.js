import React, { Component } from  'react';
import {  bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { getMyPurchases } from "../../../../../../services/marketplace/myPurchases/myPurchesesActions";
import Pagination from '../../../../../../components/Pagination/Pagination';
import './my-purchases.scss';


class MyPurchases extends Component {

  componentDidMount() {
    this.props.myPurchasesActions.getMyPurchases();
  }

  render() {
    return <div />;
  }
}

export default  connect(
  state => ({
    ...state.default
  }),
  (dispatch) => ({
    myPurchasesActions: bindActionCreators({
      getMyPurchases
    }, dispatch)
  })
)(injectIntl(MyPurchases));
