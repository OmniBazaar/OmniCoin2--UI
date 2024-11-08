import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SaleTime from '../SaleTime/SaleTime';
import StageProgress from '../StageProgress/StageProgress';

import {
  exchangeRequestSale,
  exchangeSetInProgressPhase
} from '../../../../../../services/exchange/exchangeActions';

class Sale extends Component {
	state = {
		phaseInProgress: null
	}

	componentWillMount() {
		this.props.exchangeActions.exchangeRequestSale();
		this.updateSaleTimer = setInterval(() =>{
			this.props.exchangeActions.exchangeRequestSale(true);
		}, 30000);
	}

	componentWillUnmount() {
		clearInterval(this.updateSaleTimer);
	}

	onChangePhaseInProgress = (inProgressPhase, waitingPhase) => {
		this.props.exchangeActions.exchangeSetInProgressPhase(inProgressPhase, waitingPhase);
	}

	render() {
		return (
			<div className='sale-meta-container'>
        <SaleTime onChangePhaseInProgress={this.onChangePhaseInProgress} />
        <StageProgress />
      </div>
		);
	}
}

export default connect(
	null,
	dispatch => ({
		exchangeActions: bindActionCreators({
			exchangeRequestSale,
			exchangeSetInProgressPhase
		}, dispatch)
	})
)(Sale)