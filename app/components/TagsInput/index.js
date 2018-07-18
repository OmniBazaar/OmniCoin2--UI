import React, { Component } from 'react';
import TagsInputField from 'react-tagsinput';
import './style.scss';

export default class TagInput extends Component {
  render() {
    return (<TagsInputField {...this.props} addKeys={[9, 13, 32, 188]} />);
  }
}
