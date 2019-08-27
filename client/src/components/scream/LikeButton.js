import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MyButton from "../common/MyButton";
import { connect } from "react-redux";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import { likeScream, unlikeScream } from "../../redux/actions";

class LikeButton extends Component {
  likedScream = () => {
    const {
      user: { likes },
      screamId
    } = this.props;
    const item = likes.find(like => like.screamId === screamId);
    return !!item;
  };
  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };

  render() {
    const likeButton = !this.props.user.authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorderIcon color="primary" />
        </MyButton>
      </Link>
    ) : this.likedScream() ? (
      <MyButton tip="Undo like" onClick={this.unlikeScream}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeScream}>
        <FavoriteBorderIcon color="primary" />
      </MyButton>
    );

    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired
};

export default connect(
  state => ({ user: state.user }),
  { likeScream, unlikeScream }
)(LikeButton);
