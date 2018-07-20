import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import classNames from 'classnames';
import './style.scss';

export default class FormInputWithIconOnRight extends Component {
  render() {
    const { input, rightButtonText, ...params } = this.props;

    return (
      <div className="hybrid-input">
        <input
          {...input}
          {...params}
          type="text"
          className="textfield"
        />
        <Button type="button" className="button--gray-text">
          {rightButtonText}
        </Button>
      </div>
    );
  }
}
