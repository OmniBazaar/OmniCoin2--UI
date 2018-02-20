import React, {Component} from 'react';
import Button, {ButtonTypes} from '../../../../components/Button';
import SplitPane from 'react-split-pane';

import './mail.scss';

export default class Mail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth
    }
  }

  componentDidMount () {
    this.setState({width: this.container.offsetWidth});
  }

  _renderItems() {
    return (
      <div className='mail-items'>
        <div className='item active'>
          <span>Inbox</span>
          <span className='amount'>1</span>
        </div>
        <div className='item'>
          <span>Outbox</span>
        </div>
        <div className='item'>
          <span>Sent</span>
        </div>
        <div className='item last-item'>
          <span>Deleted</span>
        </div>
      </div>
    );
  }

  _renderMessages() {
    return (
      <div className='mail-messages'>
        <div className='mail-summary active'>
            <div className='top-detail'>
              <div className='from'>From</div>
              <div className='date'>08:56:15 AM</div>
            </div>
            <div className='title'>
              Title
            </div>
        </div>

        <div className='mail-summary new'>
          <div className='top-detail'>
            <div className='from'>alex.m@mail.com</div>
            <div className='date'>08:56:15 AM</div>
          </div>
          <div className='title'>
            Title
          </div>
        </div>

        <div className='mail-summary'>
          <div className='top-detail'>
            <div className='from'>From</div>
            <div className='date'>08:56:15 AM</div>
          </div>
          <div className='title'>
            Title
          </div>
        </div>
      </div>
    );
  }

  _renderMessage() {
    return (
      <div className='mail-message'>Column 3</div>
    );
  }

  _renderMailBody() {
    return (
      <div className='body'>
        {this._renderItems()}
        {this._renderMessages()}
        {this._renderMessage()}
      </div>
    );
  }

  renderOLD() {
    return (
      <div className='container'>
        <div className='header'>
          <span className='title'>Mail</span>
          <Button type={ButtonTypes.PRIMARY}>COMPOSE</Button>
        </div>
        {this._renderMailBody()}
      </div>
    );
  }

  render() {
    let width = this.state.width;
    let defaultSize = width / 5;
    return (
      <div ref={container => {this.container = container}} className='container'>
        <div className='header'>
          <span className='title'>Mail</span>
          <Button type={ButtonTypes.PRIMARY}>COMPOSE</Button>
        </div>
        <div className='body'>
          <SplitPane split="vertical" minSize={50} defaultSize={defaultSize} style={{position: 'relative'}}>
            {this._renderItems()}
            <SplitPane split="vertical" minSize={50} defaultSize={defaultSize} style={{position: 'relative'}}>
              {this._renderMessages()}
              {this._renderMessage()}
            </SplitPane>
          </SplitPane>
        </div>
      </div>
    )
  }
}
