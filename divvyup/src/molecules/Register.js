import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import AccountForm from "../forms/AccountForm";
import divvyLogo from "../img/divvy-logo.png";

//ENCRYPT IN FRONTEND TOO

export default class register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      redirect: false,
      user: undefined
    };
  }

  handleResponse = res => {
    let newState = res.data
      ? { redirect: true, user: res.data.user }
      : { error: "Username Taken" };
    this.setState(newState);
  };

  validPassword = password => {
    let nonAlphaNumeric = false,
      passwordLength = password.length,
      charCode;
    for (let i = 0; i < passwordLength; i++) {
      charCode = password.charCodeAt(i);
      if (
        !(charCode > 47 && charCode < 58) && // numeric (0-9)
        !(charCode > 64 && charCode < 91) && // upper alpha (A-Z)
        !(charCode > 96 && charCode < 123)
      ) {
        // lower alpha (a-z)
        nonAlphaNumeric = true;
      }
    }
    let needLowercase = password.toUpperCase() === password,
      needUppercase = password.toLowerCase() === password,
      needSpecial = !nonAlphaNumeric,
      testPassed = !(needLowercase || needUppercase || needSpecial);
    return {
      testPassed,
      needLowercase,
      needUppercase,
      needSpecial
    };
  };

  rejectionCondition = formInfo => {
    const {
      testPassed,
      needLowercase,
      needUppercase,
      needSpecial
    } = this.validPassword(formInfo.password);
    if (!testPassed) {
      let errorMessages = [
        "Password must:\n",
        needUppercase ? "Contain a Capital Character\n" : "",
        needLowercase ? "Contain a Lowercase Character\n" : "",
        needSpecial ? "Contain a Non-Alphanumeric Character\n" : ""
      ];
      let message = errorMessages.reduce(
          (accumulator, curr) => accumulator + curr
        ),
        error = message.split("\n").map((item, i) => <div key={i}>{item}</div>);
      this.setState({ error });
      return true;
    }
    return false;
  };

  render() {
    if (this.state.redirect) {
      let pathname =
        this.props.location.state && this.props.location.state.lastPage //if these two exist
          ? this.props.location.state.lastPage
          : "/profile/" + this.state.user.username;
      return (
        <Redirect to={{ pathname, state: { userID: this.state.user.id } }} />
      );
    }
    return (
      <div className="container">
        <img src={divvyLogo} alt="profile" className="divvy-logo" />
        <div className="error">{this.state.error}</div>
        <AccountForm
          submitRoute="/register"
          formName="Create an Account"
          handleResponse={this.handleResponse}
          rejectionCondition={this.rejectionCondition}
        />
        <div>Got an account?</div>
        <Link to={"/login"}>Sign in here!</Link>
      </div>
    );
  }
}
