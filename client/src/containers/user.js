import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { compose } from "recompose";

import Grid from "@material-ui/core/Grid";
import Scream from "../components/scream/Scream";

// Reducx stuff
import { connect } from "react-redux";
import { getUserDataByUserHandle } from "../redux/actions";

const styles = theme => ({
  ...theme
});

class User extends Component {
  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.getUserDataByUserHandle(handle);
  }

  render() {
    return <div>User page</div>;
  }
}

User.propTypes = {
  data: PropTypes.object.isRequired,
  getUserDataByUserHandle: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const enhance = compose(
  connect(
    state => ({
      data: state.scream
    }),
    { getUserDataByUserHandle }
  ),
  withStyles(styles)
);
export default enhance(User);
