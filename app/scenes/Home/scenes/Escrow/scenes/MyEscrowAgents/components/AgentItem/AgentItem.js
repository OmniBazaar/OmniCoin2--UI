import React, { Component } from 'react';
import { Input, Icon, Button, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CheckBox from '../../../../../../../../components/Checkbox/Checkbox';
import UserIcon from './images/th-user-white.svg';
import './agent-item.scss';

const iconSize = 20;

class AgentItem extends Component {
  render() {
    const {
      isSelected,
      toggleSelect,
      name
    } = this.props;
    return (
      <div className="agent-item">
        <div className="left-part">
          <div className="icon">
            <Image src={UserIcon} width={iconSize} height={iconSize} />
          </div>
          <span>{name}</span>
        </div>
        <CheckBox
          value={isSelected}
          onChecked={toggleSelect}
        />
      </div>
    );
  }
}

AgentItem.propTypes = {
  isSelected: PropTypes.bool,
  toggleSelect: PropTypes.func,
  name: PropTypes.string
};

AgentItem.defaultProps = {
  isSelected: false,
  toggleSelect: null,
  name: 'Agent'
};

export default AgentItem;

