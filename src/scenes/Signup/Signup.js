/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, {Component} from 'react';


import BtnLock from '../../assets/images/common/btn-lock-norm+pres.svg';
import Background from '../../components/Background/Background';
import './signup.scss';

export default class Signup extends Component {
    // static propTypes = {
    //     accountKey: string
    // };

    static defaultProps = {
        accountKey: "gr4dfyu6789hg3vg5mn2"
    };

    render() {
        return (
            <Background>
                <div className="signup-container">
                    <img src={BtnLock} height={50} width={50}></img>
                    <span>{this.props.accountKey}</span>
                    <div className="password">
                        <input className="form-control" placeholder="Enter password"></input>
                        <button className="btn btn-success">UNLOCK</button>
                    </div>
                </div>
            </Background>
        )
    }
}
