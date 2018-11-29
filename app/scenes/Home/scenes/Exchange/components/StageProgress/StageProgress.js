import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import messages from '../../messages';

const initialState = {
	soldXom: '--',
	availableXom: '--'
};

class StageProgress extends Component {
	state = initialState;

	componentDidMount() {
		if (!this.props.exchange.requestingSale) {
			this.calculateProgress(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.phase !== this.props.phase) {
			this.calculateProgress(nextProps);
		} else if (this.props.exchange.requestingSale && !nextProps.exchange.requestingSale) {
			if (nextProps.exchange.requestingSaleError) {
				this.setState(initialState);
			} else {
				this.calculateProgress(nextProps);
			}
		}
	}

	calculateProgress(props) {
		if (!props.phase || !props.exchange.sale.progress) {
			this.setState(initialState);
			return;
		}

		const { progress } = props.exchange.sale;
		const { phase } = props;
		let soldXom;
		let availableXom;
		if (progress.phase === phase.name) {
			soldXom = parseFloat(progress.sold);
		} else {
			soldXom = 0;
		}

		availableXom = parseFloat(phase.xom) - soldXom;

		this.setState({ soldXom, availableXom });
	}

	calculateSoldPercent() {
		if (!isNaN(this.state.soldXom)) {
			const p = this.state.soldXom / (this.state.soldXom + this.state.availableXom) * 100;
			return Math.round(p * 100) / 100
		}

		return 50;
	}

	render() {
		const { formatMessage } = this.props.intl;
		const sold = this.calculateSoldPercent();

		return (
			<div className='stage-progress'>
				<div className='heading'>{formatMessage(messages.stageProgress)}</div>
				<div className='content'>
					<div className='coins-status'>
						<div className='coins sold'>
							<div className='title'>{formatMessage(messages.omnicoinsSold)}</div>
							<div className='amount'>{this.state.soldXom} XOM</div>
						</div>
						<div className='coins available'>
							<div className='title'>{formatMessage(messages.omnicoinsAvailable)}</div>
							<div className='amount'>{this.state.availableXom} XOM</div>
						</div>
					</div>
					<div className='progress'>
						<div className='sold' style={{width: `${sold}%`}}>
							<span>{sold < 5 ? '' : `${sold}%`}</span>
						</div>
						<div className='available' style={{width: `${100 - sold}%`}}>
							<span>{100 - sold >= 5 ? `${100 - sold}%` : ''}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		exchange: state.default.exchange
	})
)(injectIntl(StageProgress));