import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import classNames from 'classnames';

import './header.scss';

export default class Header extends Component {
  render() {
    const { props } = this;

    const containerClass = classNames({
      'button--primary': props.className === 'button--primary',
      'button--green': props.className === 'button--green',
      'button--green-bg': props.className === 'button--green-bg',
      'button--transparent': props.className === 'button--transparent',
    });

    return (
      <div className="header">
        <span className="title">{props.title}</span>
        {props.hasButton ?
          <Button
            content={props.buttonContent}
            onClick={props.onClick}
            loading={props.loading}
            className={containerClass}
          />
        : null }
      </div>
    );
  }
}
