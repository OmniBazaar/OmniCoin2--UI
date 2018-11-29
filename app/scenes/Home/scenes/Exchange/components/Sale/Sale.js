import React, { Component } from 'react';
import SaleTime from '../SaleTime/SaleTime';
import StageProgress from '../StageProgress/StageProgress';

export default class Sale extends Component {
	state = {
		phaseInProgress: null
	}

	onChangePhaseInProgress = (phase) => {
		this.setState({
			phaseInProgress: phase
		});
	}

	render() {
		return (
			<div className='sale-meta-container'>
        <SaleTime onChangePhaseInProgress={this.onChangePhaseInProgress} />
        <StageProgress phase={this.state.phaseInProgress} />
      </div>
		);
	}
}