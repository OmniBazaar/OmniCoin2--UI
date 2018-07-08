/**
 * created by alaverdyanrafayel on 08/07/18
 */

import React, { Component } from 'react';
import Background from '../../components/Background/Background';
import AirDropForm from './components/AirDropForm/AirDropForm';

class AirDrop extends Component {
  render() {
    return (
      <Background>
        <AirDropForm />
      </Background>
    );
  }
}

export default AirDrop;
