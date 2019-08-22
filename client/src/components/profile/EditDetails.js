import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import MyButton from "../common/MyButton";

//MUI stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Icons
import EditIcon from "@material-ui/icons/Edit";

// Reducx stuff
import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions";

const styles = theme => ({
  ...theme,
  button: {
    float: "right"
  }
});

class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false
  };

  componentDidMount() {
    this.mapUserDetailsToState(this.props.credentials);
  }

  mapUserDetailsToState = credentials => {
    const { bio, website, location } = credentials;
    this.setState(() => {
      return {
        bio: bio || "",
        website: website || "",
        location: location || ""
      };
    });
  };

  handleOpen = () => {
    this.setState(() => {
      return {
        open: true
      };
    });
  };

  handleClose = () => {
    this.setState(() => {
      return {
        open: false
      };
    });
  };

  handleChange = event => {
    this.setInternalState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location
    };
    this.props.editUserDetails(userDetails);
  };

  setInternalState(value) {
    this.setState(() => {
      return value;
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Edit details"
          onClick={this.handleOpen}
          btnClassName={classes.button}
          tipPlacement="left"
        >
          <EditIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update your details, please enter your new informations below.
            </DialogContentText>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placedholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                placedholder="Your personal/professional website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                type="text"
                label="Location"
                placedholder="Where you live"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  credentials: state.user.credentials
});

const mapActionsToProps = {
  editUserDetails
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(EditDetails));
