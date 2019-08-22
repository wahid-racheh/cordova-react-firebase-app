import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyButton from "../common/MyButton";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";

//Redux stuff
import { connect } from "react-redux";

// MUI stuff
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";

const styles = theme => ({
  card: {
    display: "flex",
    marginBottom: 20,
    position: "relative"
  },
  cardActionArea: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      maxHeight: "12rem"
    },
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  image: {
    minWidth: "40%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "12rem"
    },
    [theme.breakpoints.down("sm")]: {
      height: "auto",
      maxHeight: 400
    }
  },
  content: {
    padding: 25,
    objectFit: "cover",
    width: "60%"
  }
});

class Scream extends Component {
  render() {
    dayjs.extend(relativeTime);

    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        userImage,
        userHandle,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardActionArea
          disableRipple
          component="div"
          className={classes.cardActionArea}
        >
          <CardMedia
            component="img"
            alt="user image"
            className={classes.image}
            image={userImage}
            title="Profile image"
          />
          <CardContent className={classes.content}>
            <Typography
              variant="h5"
              component={Link}
              color="primary"
              to={`/users/${userHandle}`}
            >
              {userHandle}
            </Typography>
            {deleteButton}
            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).fromNow()}
            </Typography>
            <Typography variant="body1">{body}</Typography>
            <LikeButton screamId={screamId} />
            <span>{likeCount} Likes</span>
            <MyButton tip="comments">
              <ChatIcon color="primary" />
            </MyButton>
            <span>{commentCount} Comments</span>
            <ScreamDialog screamId={screamId} userHandle={userHandle} />
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

Scream.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(Scream));
