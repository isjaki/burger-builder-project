import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { checkValidity } from '../../shared/utility';

import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';

import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        },
        isSignup: true
    };

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({controls: updatedControls});
    }

    submitHandler = event => {
        event.preventDefault();

        this.props.onAuth(
            this.state.controls.email.value,
            this.state.controls.password.value,
            this.state.isSignup
        );
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => ({
            isSignup: !prevState.isSignup
        }));
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to={this.props.authRedirectPath} />;
        }
        
        const formElementsArray = [];

        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        const formFields = formElementsArray.map(formElement => (
            <Input 
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
        ));

        const errorMessage = this.props.error ? <p>{this.props.error.message}</p> : null;

        return (
            <div className={classes.Auth}>
                {errorMessage}
                {this.props.loading ? <Spinner /> : 
                <form onSubmit={this.submitHandler}>
                    {formFields}
                    <Button btnType="Success">Submit</Button>
                </form>}
                <Button 
                    btnType="Danger"
                    clicked={this.switchAuthModeHandler}
                >
                    Switch to {this.state.isSignup ? 'Sign In' : 'Sign Up'}
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loading: state.authReducer.loading,
    error: state.authReducer.error,
    isAuthenticated: state.authReducer.token !== null,
    buildingBurger: state.burgerBuilderReducer.buildingBurger,
    authRedirectPath: state.authReducer.authRedirectPath
});

const mapDispatchToProps = dispatch => ({
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);