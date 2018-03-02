import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Button, Form, Image } from 'semantic-ui-react'
import {required} from 'redux-form-validators';
import {toastr} from 'react-redux-toastr'
import cn from 'classnames';

import { login } from  '../../../../services/blockchain/auth/authActions';

import './login-form.scss';
import BtnLock from '../../../../assets/images/common/btn-lock-norm+pres.svg';
import ValidatableField from '../../../../components/ValidatableField/ValidatableField';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    state = {
        showUsernameInput: false,
        isLoading: false,
    };

    componentWillMount() {
        if (!this.props.auth.currentUser) {
            this.setState({
                showUsernameInput: true
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.error && !this.props.auth.error) {
            toastr.error("Error", nextProps.auth.error);
        }
    }

    submit(values) {
        const {password, username} = values;
        this.setState({isLoading: true});
        this.props.authActions.login(
            username,
            password,
            () => {this.setState({isLoading: false})}
        );
    }

    renderPasswordField = ({input, disabled, loading, meta: {touched, error, warning}}) => {
        let btnClass = cn(loading ? "ui loading" : "");
        return (
            <div>
                {touched && ((error && <span className="error">{error}</span>))}
                <div className="password">
                    <input
                        {...input}
                        type="password"
                        placeholder="Enter password"
                    />
                    <Button
                        content="UNLOCK"
                        disabled={disabled || this.state.isLoading}
                        color="green"
                        type="submit"
                        className={btnClass}
                    />
                </div>
            </div>
        );
    };

    render() {
        const {handleSubmit, valid, auth} = this.props;
        const {showUsernameInput} = this.state;
        return (
            <Form
                onSubmit={handleSubmit(this.submit)}
                className="login"
                style={{justifyContent: showUsernameInput ? "center" : "space-between"}}
            >
                {showUsernameInput ?
                    <div className="username">
                        <Field
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            component={ValidatableField}
                            validate={[required({message: "This field is required"})]}
                        />
                    </div>
                    :
                    [
                        <Image src={BtnLock} width={50} height={50}/>,
                        <span>{auth.currentUser.username}</span>
                    ]
                }
                <Field
                    name="password"
                    disabled={!valid}
                    loading={this.state.isLoading}
                    component={this.renderPasswordField}
                    validate={[required({message: "This field is required"})]}
                />
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
        authActions: bindActionCreators({login}, dispatch),
    })
)(LoginForm);