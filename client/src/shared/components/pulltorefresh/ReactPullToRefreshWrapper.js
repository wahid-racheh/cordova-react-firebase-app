import React from "react";
import { Subject } from "rxjs";
import { componentHasChild } from "../../../helpers";
import { isEmpty } from "../../../utils/utility";

import ReactPullToRefresh from "react-pull-to-refresh";

import "./ReactPullToRefreshWrapper.css";

class ReactPullToRefreshWrapper extends React.Component {
  obs = new Subject();
  subscription;
  isRefreshTriggered = false;

  componentWillReceiveProps(nextProps) {
    const { loading } = nextProps;
    if (!loading) {
      this.obs.next(loading);
    }
  }

  unsubscribe = () => {
    this.isRefreshTriggered = false;
    this.subscription && this.subscription.unsubscribe();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleRefresh = (resolve, reject) => {
    let { action, actionParams } = this.props;
    if (!this.isRefreshTriggered) {
      this.isRefreshTriggered = true;
      if (isEmpty(actionParams)) {
        action();
      } else {
        action(...actionParams);
      }
      this.subscription = this.obs.subscribe(value => {
        this.unsubscribe();
        resolve();
      });
    }
  };

  render() {
    const { children, authenticated } = this.props;
    return (
      <ReactPullToRefresh
        onRefresh={this.handleRefresh}
        style={{
          textAlign: "center"
        }}
      >
        {React.Children.map(children, childElement => {
          if (componentHasChild(childElement, ReactPullToRefreshWrapper)) {
            return React.cloneElement(childElement, {
              authenticated
            });
          }
          return childElement;
        })}
      </ReactPullToRefresh>
    );
  }
}

export default ReactPullToRefreshWrapper;
