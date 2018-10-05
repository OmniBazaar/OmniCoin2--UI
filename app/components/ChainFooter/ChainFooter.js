import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'semantic-ui-react';
import { connect as connectToNode } from "../../services/blockchain/connection/connectionActions";

import Latency from '../Latency/Latency';
import { getColor } from '../../services/blockchain/latency/latency';
import './chain-footer.scss';

class ChainFooter extends Component {

  reconnect = () => {
    const { nodes } = this.props.config;
    this.props.connectionActions.connectToNode(nodes);
  }

  render() {
    const {
      latency,
      isConnected,
      isConnecting,
      block
    } = this.props;
    const color = getColor(latency);
    return (
      <div
        className="chain-footer"
        style={{
          backgroundColor: isConnected ? color : 'red',
        }}
      >
        {isConnected &&
          <span>
            <Latency latency={latency}/> | <FormattedMessage id="ChainFooter.block" defaultMessage="Block"/> : #{block}
          </span>
        }
        {!isConnected && isConnecting &&
          <FormattedMessage
            id="ChainFooter.connecting"
            defaultMessage="Connecting..."
          />
        }
        {!isConnected && !isConnecting &&
          <div>
            <span
              className="refresh"
              onClick={() => this.reconnect()}
            >
              <FormattedMessage
                id="ChainFooter.refresh"
                defaultMessage="Refresh"
              />
            </span>
            <FormattedMessage
              id="ChainFooter.noConnection"
              defaultMessage="No connection"
            />
          </div>
        }
      </div>
    );
  }
}

export default connect((state) => {
  const {
    error, dynGlobalObject, latency, isLoading
  } = state.default.connection;
  return {
    isConnected: !error && !isLoading,
    isConnecting: isLoading,
    block: dynGlobalObject ? dynGlobalObject.head_block_number : null,
    latency,
    config: state.default.config
  };
}, (dispatch) => ({
  connectionActions: bindActionCreators({ connectToNode }, dispatch)
}))(ChainFooter);

ChainFooter.propTypes = {
  isConnected: PropTypes.bool,
  block: PropTypes.number,
  latency: PropTypes.number,
};

ChainFooter.defaultProps = {
  isConnected: false,
  block: null,
  latency: null,
};
