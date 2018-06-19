import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import cn from 'classnames';

import LikeBtn from './images/btn-like.svg';
import DislikeBtn from './images/btn-dislike.svg';
import './voting-toggle.scss';

const messages = defineMessages({
  voteUpTooltip: {
    id: 'VotingToggle.voteUpTooltip',
    defaultMessage: 'Click here when you satisfied with the seller\'s product or performance. Doing so will release the escrowed funds to the seller.'
  },
  voteDownTooltip: {
    id: 'VotingToggle.voteDownTooltip',
    defaultMessage: 'Click here if you need or want to reject or terminate this escrow transaction. Doing so will return the escrowed funds to the buyer'
  },
});

class VotingToggle extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    const {
      type,
      onToggle,
      isToggled,
      size
    } = this.props;
    const img = type === 'up' ? LikeBtn : DislikeBtn;
    const tooltip = type === 'up' ? formatMessage(messages.voteUpTooltip) : formatMessage(messages.voteDownTooltip);
    const voteClass = cn({
      'voting-toggle': true,
      voted: isToggled
    });
    return (
      <div className={voteClass} title={tooltip}>
        <Image
          src={img}
          width={size}
          height={size}
          onClick={() => onToggle(!isToggled)}
        />
      </div>
    );
  }
}

VotingToggle.defaultProps = {
  type: 'up',
  onToggle: () => {},
  intl: () => {},
  isToggled: false,
  size: 18
};

VotingToggle.propTypes = {
  type: PropTypes.oneOf(['up', 'down']),
  onToggle: PropTypes.func,
  isToggled: PropTypes.bool,
  size: PropTypes.number,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
};

export default (injectIntl(VotingToggle));
