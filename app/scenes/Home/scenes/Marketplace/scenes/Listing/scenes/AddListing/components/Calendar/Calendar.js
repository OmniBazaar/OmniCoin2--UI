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
      const newTime = moment(new Date(), 'HH:mm:ss');
      let dateTime = moment(date, 'YYYY-MM-DD HH:mm:ss');

      dateTime = dateTime.set({
        hour: newTime.get('hour'),
        minute: newTime.get('minute'),
        second: newTime.get('second')
      });

      onChange(date ? dateTime.format('YYYY-MM-DD HH:mm:ss') : '');
    }
  }

  render() {
    const { value } = this.props.input;
    const minDate = this.props.minDate ? moment(this.props.minDate) : moment();
    const maxDate = this.props.maxDate ? moment(this.props.maxDate) : null;
    return (
      <div className="hybrid-input">
        <label>
          <DatePicker
            selected={value ? moment(value) : null}
            placeholderText={this.props.placeholder}
            onChange={this.onChange.bind(this)}
            minDate={minDate}
            maxDate={maxDate}
            showTimeSelect={false}
            timeFormat="HH:mm:ss"
          />
          <Image className="calendar-icon" src={CalendarIcon} width={size} height={size} />
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
