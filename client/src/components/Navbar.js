import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MyButton from "../utils/MyButton";
import PostScream from "./PostScream";
import PostContact from "./PostContact";

// MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { logoutUser } from "../redux/actions/user.actions";
import { ADD_SCREAM, ADD_CONTACT } from "../utils/constants";

import AuthGuardWrapper from "../utils/AuthGuardWrapper";

class Navbar extends Component {
  render() {
    const { logoutUser, addAction } = this.props;

    const isActionOf = action => {
      return addAction === action;
    };

    const addButtonWrapper = isActionOf(ADD_SCREAM) ? (
      <PostScream />
    ) : isActionOf(ADD_CONTACT) ? (
      <PostContact />
    ) : null;
    return (
      <AppBar position="fixed">
        <Toolbar className="nav-container">
          <AuthGuardWrapper>
            <AuthGuardWrapper.On>
              <Fragment>
                {addButtonWrapper}
                <Link to="/">
                  <MyButton tip="Home">
                    <HomeIcon />
                  </MyButton>
                </Link>
                {/* <MyButton tip="Notifications">
                  <NotificationsIcon />
                </MyButton> */}
                <Link to="/contacts">
                  <MyButton tip="Contacts">
                    <HowToRegIcon />
                  </MyButton>
                </Link>
                <MyButton tip="Logout" onClick={logoutUser}>
                  <ExitToAppIcon />
                </MyButton>
              </Fragment>
            </AuthGuardWrapper.On>
            <AuthGuardWrapper.Off>
              <Fragment>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Signup
                </Button>
              </Fragment>
            </AuthGuardWrapper.Off>
          </AuthGuardWrapper>
        </Toolbar>
      </AppBar>
    );
  }
}
Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired
};

export default connect(
  state => ({
    addAction: state.UI.addAction
  }),
  { logoutUser }
)(Navbar);
