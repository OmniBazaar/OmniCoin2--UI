/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, {Component} from 'react';

import SignupForm from './components/SignupForm/SignupForm';
import Background from '../../components/Background/Background';
import './signup.scss';

export default class Signup extends Component {

    render() {
        return (
            <Background>
                <SignupForm/>
            </Background>
        )
    }
}
