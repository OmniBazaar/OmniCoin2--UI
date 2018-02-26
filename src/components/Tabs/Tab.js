import React from 'react';
import PropTypes from 'prop-types';
import './tabs.scss';

export const Tab = (props) => {
  return (
    <li className={`tab ${props.isActive ? 'active' : ''}`}
        onClick={(event) => {
          event.preventDefault();
          props.onClick(props.tabIndex);
        }}>
      <a className={`tab-link ${props.linkClassName}`}>
        <span className={`tab-icon ${props.iconClassName}`}>{props.title}</span>
      </a>
    </li>
  )
};

Tab.defaultProps = {
  linkClassName: '',
  iconClassName: '',
};


Tab.propTypes = {
  linkClassName: PropTypes.string,
  iconClassName: PropTypes.string,
};
