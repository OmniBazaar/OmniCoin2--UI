import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import cn from 'classnames';

import LikeBtn from './images/btn-like.svg';
import DislikeBtn from './images/btn-dislike.svg';
import './voting-toggle.scss';

class VotingToggle extends Component {
  render() {
    const {
      type,
      onToggle,
      isToggled,
      size
    } = this.props;
    const img = type === 'up' ? LikeBtn : DislikeBtn;
    const voteClass = cn({
      'voting-toggle': true,
      voted: isToggled
    });
    return (
      <div className={voteClass}>
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
  isToggled: false,
  size: 18
};

VotingToggle.propTypes = {
  type: PropTypes.oneOf(['up', 'down']),
  onToggle: PropTypes.func,
  isToggled: PropTypes.bool,
  size: PropTypes.number
};

export default VotingToggle;
