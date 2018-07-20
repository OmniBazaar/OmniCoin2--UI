import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import cn from 'classnames';

import './deal-rating.scss';

const messages = defineMessages({
  awful: {
    id: 'DealRating.awful',
    defaultMessage: 'AWFUL'
  },
  neutral: {
    id: 'DealRating.neutral',
    defaultMessage: 'NEUTRAL'
  },
  great: {
    id: 'DealRating.great',
    defaultMessage: 'GREAT!'
  }
});


class DealRating extends Component {
  state = {
    selectedValue: this.props.selectedValue
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.selectedValue) {
      this.setState({
        selectedValue: nextProps.selectedValue
      });
    }
  }

  renderDoth(color, isSelected, option, onClick) {
    const className = cn({
      doth: true,
      [color]: true,
      selected: isSelected
    });
    return (<div
      className={className}
      key={option.key}
      onClick={() => {
                  onClick(option);
                  this.setState({ selectedValue: option });
                }}
    />);
  }

  renderStar(color, isSelected, option, onClick) {
    const className = cn({
      doth: true,
      [color]: true,
      selected: isSelected
    });
    return (
      <span
        className={className}
        onClick={() => {
          onClick(option);
          this.setState({ selectedValue: option });
        }}
      >★
      </span>
    );
  }

  render() {
    const {
      options,
      onChange,
    } = this.props;
    const { formatMessage } = this.props.intl;
    const stars = [];
    for (let i = 0; i < options.length; ++i) {
      let color = 'red';
      if (options[i].text === 0) {
        color = 'gray';
      } else if (options[i].text > 0) {
        color = 'green';
      }
      const isSelected = options[i].key === this.state.selectedValue.key;
      stars.push(this.renderStar(color, isSelected, options[i], onChange));
    }

    return (
      <div className="deal-rating">
        <div className="doths">
          {stars}
        </div>
        <div className="footer">
          <div>
            {formatMessage(messages.awful)}
          </div>
          <div>
            {formatMessage(messages.neutral)}
          </div>
          <div>
            {formatMessage(messages.great)}
          </div>
        </div>
      </div>
    );
  }
}

DealRating.defaultProps = {
  options: [],
  onChange: () => {
  },
  selectedValue: 0,
};

DealRating.propTypes = {
  options: PropTypes.shape([]), // same structure as for Select component
  onChange: PropTypes.bool,
  selectedValue: PropTypes.bool,
};

export default injectIntl(DealRating);

