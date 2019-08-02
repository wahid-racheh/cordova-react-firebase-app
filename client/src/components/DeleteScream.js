import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../utils/MyButton";

// MUI Stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { connect } from "react-redux";
import { deleteScream } from "../redux/actions/scream.actions";

const styles = theme => ({
  ...theme,
  deleteButton: {
    left: "90%",
    top: "10%",
    position: "absolute",
    [theme.breakpoints.down("sm")]: {
      top: "73%"
    }
  }
});
class DeleteScream extends Component {
  state = {
    open: false
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
  deleteScream = () => {
    this.props.deleteScream(this.props.screamId);
    this.handleClose();
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Delete scream"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutlineIcon color="secondary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Are you sure you want to delete the scream ?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteScream} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteScream.propTypes = {
  deleteScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};
const mapActionsToProps = {
  deleteScream
};

export default connect(
  null,
  mapActionsToProps
)(withStyles(styles)(DeleteScream));
