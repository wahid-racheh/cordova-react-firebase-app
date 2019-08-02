import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { /*withState, withHandlers,*/ compose } from "recompose";
import LoaderHOC from "../components/loader/LoaderHOC";
import Scream from "../components/Scream";

class ScreamList extends Component {
  render() {
    const { screams } = this.props;

    return (
      <Fragment>
        {screams.map(scream => (
          <Scream key={scream.screamId} scream={scream} />
        ))}
      </Fragment>
    );
  }
}

ScreamList.propTypes = {
  screams: PropTypes.array.isRequired
};

const enhance = compose(
  // withState("open", "setOpen", false),
  // withHandlers({
  //   handleCkick: props => event => props.setOpen(!props.open)
  // })
  LoaderHOC("screams")
);

export default enhance(ScreamList);
