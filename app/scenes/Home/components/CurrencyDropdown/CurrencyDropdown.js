import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import './currency.scss';

const options = [
  { key: 1, text: 'USD', value: 'usd' },
  { key: 2, text: 'EURO', value: 'euro' },
  { key: 3, text: 'POUND', value: 'pound' },
];

class CurrencyDropdown extends Component {
  render() {
    return (
      <div className="dropdown currency">
        <Dropdown
          button
          className="icon"
          floating
          labeled
          icon="dollar"
          options={options}
          placeholder="CURRENCY"
        />
      </div>
    );
  }
}

export default CurrencyDropdown;
