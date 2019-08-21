import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import MyButton from "../../../shared/components/MyButton";

//MUI stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

// Reducx stuff
import { connect } from "react-redux";
import { postScream, clearErrors } from "../../../redux/actions";

const styles = theme => ({
  ...theme,
  submitButton: {
    position: "relative"
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    left: "80%",
    top: "6%",
    [theme.breakpoints.up("sm")]: {
      left: "90%"
    }
  }
});

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    errors: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    } else if (!nextProps.UI.loading) {
      this.setState(() => {
        return { open: false, errors: {}, body: "" };
      });
    }
  }
  handleOpen = () => {
    this.setState(() => {
      return { open: true };
    });
  };
  handleClose = () => {
    this.props.clearErrors();
    this.setState(() => {
      return { open: false, errors: {}, body: "" };
    });
  };
  handleChange = event => {
    const {
      target: { name, value }
    } = event;
    this.setState(() => {
      return { [name]: value, errors: {} };
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.clearErrors();
    this.props.postScream({ body: this.state.body });
  };
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;
    return (
      <Fragment>
        <MyButton tip="Post a scream" onClick={this.handleOpen}>
          <AddIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
          aria-labelledby="form-dialog-title"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle id="form-dialog-title">Post a new Scream</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="SCREAM!!"
                multiline
                rows="3"
                placeholder="Scream at your fellow apes"
                className={classes.textField}
                helperText={errors.body}
                error={errors.body ? true : false}
                value={this.state.body}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapActionsToprops = {
  postScream,
  clearErrors
};

const mapStateToProps = state => ({
  UI: state.UI
});
export default connect(
  mapStateToProps,
  mapActionsToprops
)(withStyles(styles)(PostScream));
