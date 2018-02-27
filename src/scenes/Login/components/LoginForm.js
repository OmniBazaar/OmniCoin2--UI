import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Button, Input, Form, Container, Image } from 'semantic-ui-react'

import { login, getCurrentUser } from  '../../../services/auth/authActions';

import './login-form.scss';
import BtnLock from '../../../assets/images/common/btn-lock-norm+pres.svg';


class LoginForm extends Component {
    // static propTypes = {
    //     accountKey: string
    // };

    constructor(props) {
        super(props);
        this.submit.bind(this);
    }

    state = {
        showUsernameInput: false
    };

    static defaultProps = {
        username: "denis12343"
    };

    submit(values) {
        const { password } = values;
        this.props.authActions.login(this.props.username, password);
    }

    componentWillMount() {
        if (!this.props.auth.currentUser) {
            this.setState({
                showUsernameInput: true
            })
        }
    }


   render() {
       const { handleSubmit, username } = this.props;
       const { showUsernameInput } = this.state;
       return (
           <Form
               onSubmit={handleSubmit(this.submit)}
               className="signup-container"
               style={{"justify-content": showUsernameInput ? "center" : "space-between"  }}
           >
                   {showUsernameInput ?
                       <div className="username">
                           <Field
                               type="text"
                               name="text"
                               placeholder="Enter your username"
                               component="input"/>
                       </div>
                       :
                       [
                           <Image src={BtnLock} width={50} height={50}/>,
                           <span>{username}</span>
                       ]
                   }

               <div className="password">
                       <Field
                           type="password"
                           name="password"
                           placeholder="Enter password"
                           component="input"
                       />
                   <Button content="UNLOCK" color="green" type="submit"/>
               </div>
           </Form>
       )
   }
}

LoginForm = reduxForm({
    form: 'loginForm',
    destroyOnUnmount: true,
})(LoginForm);

export default connect(
    (state) => {
        return {...state.default}
    },
    (dispatch) => ({
        authActions: bindActionCreators({ login }, dispatch),
    })
)(LoginForm);