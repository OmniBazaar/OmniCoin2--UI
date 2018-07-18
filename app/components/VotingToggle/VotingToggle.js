import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import cn from 'classnames';

import LikeBtn from './images/btn-like.svg';
import DislikeBtn from './images/btn-dislike.svg';
import './voting-toggle.scss';

class VotingToggle extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    const {
      type,
      onToggle,
      isToggled,
      size,
      showTooltip,
      tooltip
    } = this.props;
    const img = type === 'up' ? LikeBtn : DislikeBtn;
    const title = tooltip || '';
    const voteClass = cn({
      'voting-toggle': true,
      voted: isToggled
    });
    return (
      <div className={voteClass} title={title}>
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
