import React from 'react';
import PropTypes from 'prop-types';

import './badge.scss';

const Badge = (props) => (
  <div className="badge">
    <span>{props.title}</span>
    <span className="value">{props.value}</span>
  </div>
);

Badge.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};

Badge.defaultProps = {
  title: '',
  value: '',
};

export default Badge;
