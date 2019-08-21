import React, { Component, Fragment } from "react";
import { compose } from "recompose";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import withStyles from "@material-ui/core/styles/withStyles";

import MyButton from "../../../shared/components/MyButton";
import LikeButton from "./LikeButton";

//MUI stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icons
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";

// Redux
import { connect } from "react-redux";
import { getScream } from "../../../redux/actions/scream.actions";

const styles = theme => ({
  ...theme,
  invisibleSeperator: {
    border: "none",
    margin: 4
  },
  closeButton: {
    position: "absolute",
    left: "80%",
    top: "6%",
    [theme.breakpoints.up("sm")]: {
      left: "90%"
    }
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    width: 200,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  expandButton: {
    position: "absolute",
    left: "88%"
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  }
});

class ScreamDialog extends Component {
  state = {
    open: false
  };
  handleOpen = () => {
    this.setState(() => {
      return { open: true };
    });
    this.props.getScream(this.props.screamId);
  };
  handleClose = () => {
    this.setState(() => {
      return { open: false };
    });
  };
  render() {
    const {
      classes,
      data: {
        scream: {
          screamId,
          body,
          createdAt,
          likeCount,
          commentCount,
          userImage,
          userHandle
        }
      },
      UI: { loading }
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeperator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeperator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} Likes</span>
            <MyButton tip="comments">
              <ChatIcon color="primary" />
            </MyButton>
            <span>{commentCount} Comments</span>
        </Grid>
      </Grid>
    );
    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand scream"
          btnClassName={classes.expandButton}
        >
          <UnfoldMoreIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.scream,
  UI: state.UI
});

const enhance = compose(
  connect(
    mapStateToProps,
    { getScream }
  ),
  withStyles(styles)
);

export default enhance(ScreamDialog);
