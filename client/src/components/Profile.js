import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "../components/EditDetails";
import MyButton from "../utils/MyButton";

// MUI stuff
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

// Reducx stuff
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/user.actions";

import { compose } from "recompose";
import LoaderHOC from "../components/loader/LoaderHOC";
import AuthGuardWrapper from "../utils/AuthGuardWrapper";

const styles = theme => ({
  ...theme
});

class Profile extends Component {
  handleImageChange = event => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file, file.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { createdAt, imageUrl, bio, website, location, handle }
      }
    } = this.props;
    return (
      <AuthGuardWrapper>
        <AuthGuardWrapper.On>
          <Paper className={classes.paper}>
            <div className={classes.profile}>
              <div className="image-wrapper">
                <img src={imageUrl} alt="profile" className="profile-image" />

                <input
                  type="file"
                  name="image"
                  id="imageInput"
                  hidden="hidden"
                  onChange={this.handleImageChange}
                />

                <MyButton
                  tip="Edit picture"
                  onClick={this.handleEditPicture}
                  btnClassName="button"
                >
                  <EditIcon color="primary" />
                </MyButton>
              </div>
              <hr />
              <div className="profile-details">
                <MuiLink
                  component={Link}
                  to={`/users/${handle}`}
                  clolor="primary"
                  variant="h5"
                >
                  @{handle}
                </MuiLink>
                <hr />
                {bio && <Typography variant="body2">{bio}</Typography>}
                <hr />
                {location && (
                  <Fragment>
                    <LocationOn clolor="primary" /> <span>{location}</span>
                    <hr />
                  </Fragment>
                )}
                {website && (
                  <Fragment>
                    <LinkIcon color="primary" />
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      {" "}
                      {website}
                    </a>
                    <hr />
                  </Fragment>
                )}
                <CalendarToday color="primary" />{" "}
                <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
              </div>

              <MyButton
                tip="Logout"
                onClick={logoutUser}
                btnClassName="button"
                tipPlacement="right"
              >
                <KeyboardReturn color="primary" />
              </MyButton>

              <EditDetails />
            </div>
          </Paper>
        </AuthGuardWrapper.On>
        <AuthGuardWrapper.Off>
          <Paper className={classes.paper}>
            <Typography component={"span"} variant="body2" align="center">
              No profile found, please login again
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/signup"
                >
                  Signup
                </Button>
              </div>
            </Typography>
          </Paper>
        </AuthGuardWrapper.Off>
      </AuthGuardWrapper>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  logoutUser,
  uploadImage
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapActionsToProps
  ),
  withStyles(styles),
  LoaderHOC("user")
);

export default enhance(Profile);
