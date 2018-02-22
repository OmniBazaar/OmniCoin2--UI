import React, { Component } from 'react';
import classNames from 'classnames';
import '../styles/_textfield.scss';

const TextFieldTypes = Object.freeze({
  PASSWORD: 'password',
  TEXT: 'text',
  EMAIL: 'email',
  NUMBER: 'number',
  PHONE_NUMBER: 'tel',
  DATE: 'date',
});

export {
  TextFieldTypes,
};

export default class TextField extends Component {

  static defaultProps = {
    type: TextFieldTypes.TEXT,
    success: false,
    error: false,
    disabled: false,
    multiline: false,
    numberOfLines: 1,
    tabIndex: 0,
  };

  focus = () => {
    this.refs.input.focus();
  };

  setSelectionRange = (...args) => {
    this.refs.input.setSelectionRange(...args);
  };

  handleChange = (e) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(e.target.value);
    }
  };

  render() {
    const { props } = this;

    const inputClass = classNames({
      'textfield': true,
      'textarea': props.multiline,
      'field--success': props.success,
      'field--error': props.error,
      'field--disabled': props.disabled,
    }, props.className);

    return (
      <div className='field' style={props.style}>
        {props.multiline ? (
          <textarea
            ref='input'
            tabIndex={props.tabIndex}
            onFocus={props.onFocus}
            name={props.name}
            className={inputClass}
            rows={props.numberOfLines}
            value={props.value}
            onChange={this.handleChange}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onKeyDown={props.onKeyDown}
          />
        ) : (
          <input
            ref='input'
            tabIndex={props.tabIndex}
            onFocus={props.onFocus}
            name={props.name}
            type={props.type}
            className={inputClass}
            value={props.value}
            onChange={this.handleChange}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onKeyDown={props.onKeyDown}
            max={props.max}
          />
        )}
        {props.hint ? (
          <div className='textfield--hint'>{props.hint}</div>
        ) : null}
      </div>
    );
  }
}
