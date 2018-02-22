import React from 'react';
import classNames from 'classnames';
import '../styles/_button.scss';

const ButtonTypes = Object.freeze({
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GREEN: 'green',
  GRAY: 'gray',
  TRANSPARENT: 'transparent',
});

export {
  ButtonTypes,
};

const Button = (props) => {
  const containerClass = classNames({
    'button': true,
    'button--primary': props.type === ButtonTypes.PRIMARY,
    'button--secondary': props.type === ButtonTypes.SECONDARY,
    'button--gray': props.type === ButtonTypes.GRAY,
    'button--green': props.type === ButtonTypes.GREEN,
    'button--transparent': props.type === ButtonTypes.TRANSPARENT,
    'button--small': props.small,
    'button--disabled': props.disabled,
    'button--focused': props.focused,
  }, props.className);

  const onClick = props.disabled ? undefined : props.onClick;

  return (
    <button className={containerClass} onClick={onClick} children={props.children} style={props.style} />
  );
};

export default Button;
