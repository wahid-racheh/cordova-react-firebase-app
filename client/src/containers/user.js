import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { compose } from "recompose";

import Grid from "@material-ui/core/Grid";
import Scream from "../components/scream/Scream";
import StaticProfile from "../components/profile/StaticProfile";

// Reducx stuff
import { connect } from "react-redux";
import { getUserDataByUserHandle } from "../redux/actions";

import reloadable from "../components/common/reloadable";

const styles = theme => ({
  ...theme
});

class User extends Component {
  state = {
    screamIdParam: null
  };
  componentDidMount() {
    const { handle, screamId } = this.props.match.params;
    if (screamId) {
      this.setState(() => {
        return { screamIdParam: screamId };
      });
    }
    this.props.getUserDataByUserHandle(handle);
  }
  render() {
    const { loading, screams, profile } = this.props;
    const { screamIdParam } = this.state;

    const screamsMarkup = loading ? (
      <p>Loading data ...</p>
    ) : screams === null ? (
      <p>No scream from this user</p>
    ) : (
      screams.map(s => {
        if (!screamIdParam || s.screamId !== screamIdParam) {
          return <Scream key={s.screamId} scream={s} />;
        } else {
          return <Scream key={s.screamId} scream={s} openDialog />;
        }
      })
    );
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {screamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {!profile.handle ? (
            <p>Loading profile ...</p>
          ) : (
            <StaticProfile profile={profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

User.propTypes = {
  screams: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
  getUserDataByUserHandle: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const enhance = compose(
  connect(
    state => ({
      screams: state.scream.screams,
      loading: state.user.loading,
      profile: state.user.selectedUser
    }),
    { getUserDataByUserHandle }
  ),
  withStyles(styles)
);

export default reloadable(enhance(User));
