import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyButton from "../utils/MyButton";
import DeleteScream from "../components/DeleteScream";

//Redux stuff
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/scream.actions";

// MUI stuff
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const styles = theme => ({
  card: {
    display: "flex",
    marginBottom: 20,
    position: "relative"
  },
  actionArea: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.up("sm")]: {
      maxHeight: "12rem"
    },
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  image: {
    minWidth: "40%",
    [theme.breakpoints.up("sm")]: {
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
  likedScream = () => {
    const {
      user: { likes },
      scream
    } = this.props;
    const item = likes.find(like => like.screamId === scream.screamId);
    return !!item;
  };
  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.screamId);
  };
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

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorderIcon color="primary" />
        </Link>
      </MyButton>
    ) : this.likedScream() ? (
      <MyButton tip="Undo like" onClick={this.unlikeScream}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeScream}>
        <FavoriteBorderIcon color="primary" />
      </MyButton>
    );

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardActionArea component="div" className={classes.actionArea}>
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
            {likeButton}
            <span>{likeCount} Likes</span>
            <MyButton tip="comments">
              <ChatIcon color="primary" />
            </MyButton>
            <span>{commentCount} Comments</span>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

Scream.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeScream,
  unlikeScream
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Scream));
