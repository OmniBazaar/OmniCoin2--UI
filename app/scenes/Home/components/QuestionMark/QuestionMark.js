import React, { Component } from 'react';
import { Image, Popup } from 'semantic-ui-react';
import './questionMark.scss';
import Info from '../../images/info2.png';

class QuestionMark extends Component {
  render() {
    const { message } = this.props;
    return (
      <Popup
        trigger={
          <span className="question-mark">
            <Image src={Info} width={20} height={20} className='q-img' />
          </span>}
        content={message}
      />
    );
  }
}

export default QuestionMark;
