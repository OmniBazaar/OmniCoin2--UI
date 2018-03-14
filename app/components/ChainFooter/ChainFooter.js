import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Latency from '../Latency/Latency';
import { getColor } from '../../services/blockchain/latency/latency';
import './chain-footer.scss';

class ChainFooter extends Component {
  render() {
    const { latency, isConnected, block } = this.props;
    const color = getColor(latency);
    return (
      <div
        className="chain-footer"
        style={{
          backgroundColor: isConnected ? color : 'red',
        }}
      >
        {isConnected ?
          <span>
            <Latency latency={latency} /> | <FormattedMessage id="ChainFooter.block" defaultMessage="Block" /> : #{block}
          </span>
          : <FormattedMessage
            id="ChainFooter.noConnection"
            defaultMessage="No connection"
          />
        }
      </div>
    );
  }
}

export default ChainFooter;

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
