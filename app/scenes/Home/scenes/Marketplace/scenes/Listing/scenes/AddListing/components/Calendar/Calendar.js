import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { Button, Image } from 'semantic-ui-react';
import moment from 'moment';

require('react-datepicker/dist/react-datepicker-cssmodules.css');

import CalendarIcon from '../../../../../../../../images/icn-calendar.svg';

const size = 15;

class Calendar extends Component {
  onChange(date) {
    const { onChange } = this.props.input;
    if (onChange) {
      onChange(date ? date.format('YYYY-MM-DD') : '');
    }
  }

  render() {
    const { value } = this.props.input;
    return (
      <div className="hybrid-input">
        <label>
          <DatePicker
            selected={value ? moment(value) : null}
            placeholderText={this.props.placeholder}
            onChange={this.onChange.bind(this)}
          />
          <Image className='calendar-icon' src={CalendarIcon} width={size} height={size} />
        </label>
      </div>
    );
  }
}

Calendar.propTypes = {
  placeholder: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired
};

export default Calendar;
