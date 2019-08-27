import PropTypes from "prop-types";
import React, { Component } from "react";

const reloadable = WrappedComponent => {
  class Reloadable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        reload: false
      };
    }

    componentWillReceiveProps(nextProps) {
      const { location } = this.props;
      const { location: nextLocation } = nextProps;
      if (
        location &&
        //nextLocation.pathname === location.pathname &&
        nextLocation.search === location.search &&
        nextLocation.hash === location.hash &&
        nextLocation.key !== location.key
      ) {
        this.setState({ reload: true }, () => this.setState({ reload: false }));
      }
    }

    render() {
      return this.state.reload ? null : <WrappedComponent {...this.props} />;
    }
  }

  Reloadable.propTypes = {
    location: PropTypes.object
  };

  return Reloadable;
};

export default reloadable;
