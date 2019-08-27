import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// import {withState, withHandlers, compose} from recompose";
import ScreamSkeleton from "../common/ScreamSkeleton";
import Scream from "./Scream";

class ScreamList extends Component {
  render() {
    const { screams, loading } = this.props;

    let screamMarkup = !loading ? (
      screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <ScreamSkeleton />
    );
    return <Fragment>{screamMarkup}</Fragment>;
  }
}

ScreamList.propTypes = {
  screams: PropTypes.array.isRequired
};

//const enhance = compose();
// withState("open", "setOpen", false),
// withHandlers({
//   handleCkick: props => event => props.setOpen(!props.open)
// })
// LoaderHOC("screams")
export default ScreamList;
