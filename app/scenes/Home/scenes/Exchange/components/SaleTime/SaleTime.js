import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import TimeBlock from './TimeBlock';
import messages from '../../messages';

class SaleTime extends Component {

	constructor(props) {
		super(props);
		const { formatMessage } = props.intl;
		this.initialState = {
			days: '--',
			hrs: '--',
			min: '--',
			sec: '--',
			phaseHeading: formatMessage(messages.defaultSalePhaseTitle)
		};

		this.state = this.initialState;

		this.isInProgress = false;
		if (!props.exchange.requestingSale) {
			this.init(props);
		}
	}

	componentWillUnmount() {
		if (this.timeHandler) {
			clearInterval(this.timeHandler);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.exchange.requestingSale && !nextProps.exchange.requestingSale) {
			if (nextProps.exchange.requestingSaleError) {
				this.setState(this.initialState);
				this.props.onChangePhaseInProgress(null);
			} else {
				this.init(nextProps);
			}
		}

		if (this.props.exchange.sale !== nextProps.exchange.sale) {
			this.init(nextProps);
		}
	}

	init(props) {
		if (this.timeHandler) {
			clearInterval(this.timeHandler);
		}

		const sale = { ...props.exchange.sale };
		if (!sale.phases || !sale.phases.length) {
			this.setState(this.initialState);
			return;
		}

		const now = moment().unix();
		this.phaseIndex = -1;

		let hasInProgress = false;
		sale.phases.forEach((p, i) => {
			p.startTimestamp = moment.utc(p.startUtc).unix();
			p.endTimestamp = moment.utc(p.endUtc).unix();

			if (p.startTimestamp <= now && now < p.endTimestamp) {
				this.phaseIndex = i;
				hasInProgress = true;
			} else if (this.phaseIndex === -1 && p.startTimestamp > now) {
				this.phaseIndex = i;
			}
		});

		if (this.phaseIndex === -1) {
			this.setState(this.initialState);
			return;
		}

		if (hasInProgress) {
			this.isInProgress = true;
			this.props.onChangePhaseInProgress(sale.phases[this.phaseIndex], null);
		} else {
			this.props.onChangePhaseInProgress(null, sale.phases[this.phaseIndex]);
		}

		this.parsePhaseTime(props.exchange.sale);

		this.timeHandler = setInterval(() => this.parsePhaseTime(this.props.exchange.sale), 1000);
	}

	parsePhaseTime(sale) {
		if (!sale.phases || !sale.phases.length) {
			this.setState(this.initialState);
			if (this.phaseIndex !== -1) {
				this.phaseIndex = -1;
				this.props.onChangePhaseInProgress(null, null);
			}
			
			return;
		}

		if (sale.phases.length === this.phaseIndex) {
			return;
		}
		
		let phase = sale.phases[this.phaseIndex];
		const now = moment().unix();
		let isChangePhase = false;
		while (phase.endTimestamp < now) {
			this.phaseIndex++;
			if (sale.phases.length === this.phaseIndex) {
				this.setState(this.initialState);
				this.props.onChangePhaseInProgress(null, null);
				return;
			}

			phase = sale.phases[this.phaseIndex];
			isChangePhase = true;
		}

		const { formatMessage } = this.props.intl;

		let duration;
		let phaseHeading;
		if (phase.startTimestamp <= now) {
			duration = phase.endTimestamp - now;
			phaseHeading = formatMessage(messages.salePhaseInProgress, {name: phase.displayName});
			if (!this.isInProgress || isChangePhase) {
				this.props.onChangePhaseInProgress(phase, null);
			}
			this.isInProgress = true;
		} else {
			duration = phase.startTimestamp - now;
			phaseHeading = formatMessage(messages.salePhaseStartIn, {name: phase.displayName});
			this.isInProgress = false;
			if (isChangePhase) {
				this.props.onChangePhaseInProgress(null, phase);
			}
		}

		const days = this.formatTime(Math.floor(duration / 86400));
		let remain = duration % 86400;
		const hrs = this.formatTime(Math.floor(remain / 3600));
		remain = remain % 3600;
		const min = this.formatTime(Math.floor(remain / 60));
		const sec = this.formatTime(remain % 60);

		this.setState({ days, hrs, min, sec, phaseHeading });
	}

	formatTime(val) {
		return (val + '').padStart(2, '0');
	}

	render() {
		return (
			<div className='sale-time'>
				<div className='heading'>{this.state.phaseHeading}</div>
				<div className='content'>
					<TimeBlock className='days' value={this.state.days} unit='Days' />
					<TimeBlock value={this.state.hrs} unit='Hrs' />
					<TimeBlock value={this.state.min} unit='Min' />
					<TimeBlock value={this.state.sec} unit='Sec' />
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		exchange: state.default.exchange
	})
)(injectIntl(SaleTime));