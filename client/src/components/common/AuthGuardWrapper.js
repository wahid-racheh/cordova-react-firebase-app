// Created By Kent C. Dodds
// Updated by Wahid Racheh
import React from "react";
import { connect } from "react-redux";
import { componentHasChild } from "../../helpers";
import PropTypes from "prop-types";

class AuthGuardWrapper extends React.Component {
  static On = ({ authenticated, children }) => {
    return authenticated ? children : null;
  };

  static Off = ({ authenticated, children }) => {
    return authenticated ? null : children;
  };

  render() {
    // we're trying to let people render the components they want within the AuthGuardWrapper component.
    // But the On and Off components will need access to the internal `authenticated` prop. So here we can
    // take all this.props.children and make a copy of them that has those props.
    //
    // To do this, you can use:
    // 1. React.Children.map: https://reactjs.org/docs/react-api.html#reactchildrenmap
    // 2. React.cloneElement: https://reactjs.org/docs/react-api.html#cloneelement
    //
    // 🐨 you'll want to completely replace the code below with the above logic.
    return React.Children.map(this.props.children, childElement => {
      if (componentHasChild(childElement, AuthGuardWrapper)) {
        return React.cloneElement(childElement, {
          authenticated: this.props.authenticated
        });
      }
      return childElement;
    });
  }
}

AuthGuardWrapper.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default connect(state => ({ authenticated: state.user.authenticated }))(
  AuthGuardWrapper
);
