import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import AccountForm from '../forms/AccountForm';
import divvyLogo from '../img/divvy-logo.png';

//ENCRYPT IN FRONTEND TOO

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      redirect: false,
      user: undefined
    };
  }

  handleResponse = res => {
    const newState = res.data.success ? { user: res.data.user, redirect: true }
                                      : { error: 'Incorrect Username or Password' };
    this.setState(newState);
  }

  render() {
    if (this.state.redirect) {
        let pathname = (this.props.location.state && this.props.location.state.lastPage) //if these two exist
                       ? this.props.location.state.lastPage
                       : '/profile/' + this.state.user.username;
        return <Redirect to={{ pathname, state: { userID: this.state.user.id } }} />;
    }
    return (
      <div className='container'>
          <img src={divvyLogo} alt='profile' className='divvy-logo' />
          <div className='error'>{this.state.error}</div>
          <AccountForm submitRoute='/login' formName='Member Login' handleResponse={this.handleResponse}
                        rejectionCondition={() => {}} />
          <div>Don't have an account?</div>
          <Link to={'/register'}>Create one now!</Link>
      </div>
    );
  }
}
