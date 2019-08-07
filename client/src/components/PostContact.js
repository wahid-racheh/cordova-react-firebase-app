import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import MyButton from "../utils/MyButton";

//MUI stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

// Reducx stuff
import { connect } from "react-redux";
import { syncContact } from "../redux/actions/contact.actions";

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
    top: "6%"
  },
  customErrorMsg: {
    ...theme.customError,
    paddingBottom: "1rem",
    textAlign: "center"
  }
});

class PostContact extends Component {
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
    }
  }
  handleOpen = () => {
    this.setState(() => {
      return { open: true };
    });
  };
  handleClose = () => {
    this.setState(() => {
      return { open: false };
    });
  };
  handleChange = event => {
    const {
      target: { name, value }
    } = event;
    this.setState(() => {
      return { [name]: value };
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.syncContact({ body: this.state.body });
  };
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;

    return (
      <Fragment>
        <MyButton tip="Post a contact" onClick={this.handleOpen}>
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
          <DialogTitle id="form-dialog-title">Post a new Contact</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="firstName"
                type="text"
                label="First name"
                multiline
                rows="1"
                placeholder="First name"
                errors={errors.firstName}
                helperText={errors.firstName}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="lastName"
                type="text"
                label="Last name"
                multiline
                rows="1"
                placeholder="Last name"
                errors={errors.lastName}
                helperText={errors.lastName}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="middleName"
                type="text"
                label="Middle name"
                multiline
                rows="1"
                placeholder="Middle name"
                errors={errors.middleName}
                helperText={errors.middleName}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              {errors.general && (
                <Typography variant="body2" className={classes.customErrorMsg}>
                  {errors.general}
                </Typography>
              )}
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

PostContact.propTypes = {
  syncContact: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapActionsToprops = {
  syncContact
};

const mapStateToProps = state => ({
  UI: state.UI
});
export default connect(
  mapStateToProps,
  mapActionsToprops
)(withStyles(styles)(PostContact));
