import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { compose } from "recompose";

// import ReactPullToRefreshWrapper from "../../../shared/components/pulltorefresh/ReactPullToRefreshWrapper";

import Grid from "@material-ui/core/Grid";
import Profile from "../components/Profile";

// Reducx stuff
import { connect } from "react-redux";
import { getScreams, setAddAction } from "../../../redux/actions";
import { ADD_SCREAM } from "../../../constants";
import ScreamList from "../components/ScreamList";

const styles = theme => ({
  ...theme
});

class Home extends Component {
  componentDidMount() {
    this.props.setAddAction(ADD_SCREAM);
    this.props.getScreams();
  }

  render() {
    const { classes, screams /*loading, getScreams*/ } = this.props;
    return (
      <Grid container spacing={16} className={classes.home}>
        <Grid item sm={8} xs={12}>
          {/* <ReactPullToRefreshWrapper loading={loading} action={getScreams}> */}
          <ScreamList screams={screams} />
          {/* </ReactPullToRefreshWrapper> */}
        </Grid>

        <Grid item sm={4} xs={12}>
          <Grid container spacing={16}>
            <Grid item sm={12} xs={12}>
              <Profile />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  screams: PropTypes.array.isRequired,
  setAddAction: PropTypes.func.isRequired,
  getScreams: PropTypes.func.isRequired
};

const enhance = compose(
  connect(
    state => ({ screams: state.scream.screams, loading: state.scream.loading }),
    { setAddAction, getScreams }
  ),
  withStyles(styles)
);
export default enhance(Home);
