import React from 'react';
import electron from 'electron';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { dhtReconnect } from '../../services/search/dht/dhtActions';
import { connect as connectNodes } from '../../services/blockchain/connection/connectionActions';

export default (WrappedComponent) => {
	class PMHOC extends React.Component {
		componentDidMount() {
			electron.remote.powerMonitor.on('resume', this.onPowerResume.bind(this));
		}

		onPowerResume() {
			this.props.pmDhtActions.dhtReconnect();
			const { nodes } = this.props.pmConfig;
			this.props.pmConnectionActions.connectNodes(nodes);
		}

		render() {
			return <WrappedComponent {...this.props} />
		}
	}

	return connect(
		state => ({
			pmConfig: state.default.config
		}),
		dispatch => ({
			pmDhtActions: bindActionCreators({
				dhtReconnect
			}, dispatch),
			pmConnectionActions: bindActionCreators({
				connectNodes
			}, dispatch)
		})
	)(PMHOC);
}