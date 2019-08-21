import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MyButton from "./MyButton";
import AuthGuardWrapper from "./AuthGuardWrapper";
import PostScream from "../../modules/scream/components/PostScream";
// import PostContact from "../../modules/dashboard/components/PostContact";

// MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { logoutUser } from "../../redux/actions";
import { ADD_SCREAM, ADD_CONTACT } from "../../constants";

class Navbar extends Component {
  isActionOf = action => {
    return this.props.addAction === action;
  };

  doLogout = () => {
    this.props.logoutUser();
    this.isActionOf(ADD_CONTACT) && (window.location.href = "/login");
  };

  render() {
    const addButtonWrapper = this.isActionOf(ADD_SCREAM) ? (
      <PostScream />
    ) : this.isActionOf(ADD_CONTACT) ? null : null; //TODO: <PostContact />
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
                <Link to="/contact">
                  <MyButton tip="Contacts">
                    <HowToRegIcon />
                  </MyButton>
                </Link>
                <MyButton tip="Logout" onClick={this.doLogout}>
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
