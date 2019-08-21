import React, { Component } from "react";
import "./LoaderHOC.css";
import { isEmpty } from "../../../utils/utility";

const LoaderHOC = propName => WrappedComponent => {
  return class LoaderHOC extends Component {
    componentDidMount() {
      this.startTime = Date.now();
    }

    componentWillUpdate() {
      this.endTime = Date.now();
    }

    render() {
      const myProps = {
        loadTime: (this.endTime - this.startTime / 1000).toFixed(2)
      };

      return isEmpty(this.props[propName]) ? (
        <div className="loader" />
      ) : (
        <WrappedComponent {...this.props} {...myProps} />
      );
    }
  };
};

export default LoaderHOC;
