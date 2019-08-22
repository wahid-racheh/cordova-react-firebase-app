import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { compose } from "recompose";

//MUI stuff
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

//Redux stuff
import { connect } from "react-redux";
import { postComment } from "../../redux/actions";
import { Button } from "@material-ui/core";

const styles = theme => ({
  ...theme
});

class PostComment extends Component {
  state = {
    body: "",
    errors: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState(() => {
        return { errors: nextProps.UI.errors };
      });
    } else if (!nextProps.UI.loading) {
      this.setState(() => {
        return { errors: {}, body: "" };
      });
    }
  }
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
    const { postComment, screamId } = this.props;
    postComment(screamId, { body: this.state.body });
  };
  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;

    const postCommentMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={8}>
            <Grid item sm={10}>
              <TextField
                name="body"
                type="text"
                label="Comment on scream"
                error={!!errors.comment}
                helperText={errors.comment}
                value={this.state.body}
                onChange={this.handleChange}
                className={classes.textField}
                fullWidth
              />
            </Grid>
            <Grid item sm={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    ) : null;
    return postCommentMarkup;
  }
}

PostComment.propTypes = {
  UI: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  postComment: PropTypes.func.isRequired
};

const enhance = compose(
  connect(
    state => ({
      UI: state.UI,
      authenticated: state.user.authenticated
    }),
    { postComment }
  ),
  withStyles(styles)
);
export default enhance(PostComment);
