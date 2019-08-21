import React, { Fragment } from "react";
import { Subject } from "rxjs";
import { componentHasChild } from "../../../helpers";

import "./ReactPullToRefreshWrapper.css";

import WebPullToRefresh from "./wptr";

class ReactPullToRefreshWrapper extends React.Component {
  obs = new Subject();
  subscription;
  isRefreshTriggered = false;

  state = {
    initialized: false
  };

  init() {
    if (!this.state.initialized) {
      WebPullToRefresh().init({
        contentEl: this.refresh,
        ptrEl: this.ptr,
        bodyEl: this.body,
        distanceToRefresh: this.props.distanceToRefresh || undefined,
        loadingFunction: this.handleRefresh,
        resistance: this.props.resistance || undefined,
        hammerOptions: this.props.hammerOptions || undefined
      });
      this.setState({
        initialized: true
      });
    }
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.init();
    }
  }

  componentDidUpdate() {
    if (!this.props.disabled) {
      this.init();
    }
  }

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

  handleRefresh = () => {
    return new Promise((resolve, reject) => {
      this.doRefresh(resolve, reject);
    });
  };

  doRefresh = (resolve, reject) => {
    if (!this.isRefreshTriggered) {
      this.props.onRefresh(false);
      this.isRefreshTriggered = true;
      this.subscription = this.obs.subscribe(value => {
        this.unsubscribe();
        this.props.onRefresh(true);
        resolve();
      });
    }
  };

  render() {
    return (
      <Fragment>
        <div
          ref={el => {
            this.body = el;
          }}
        >
          <div
            ref={el => {
              this.ptr = el;
            }}
            className="refresher"
          >
            <div className="loading-bar" />
            <div className="loading-bar" />
            <div className="loading-bar" />
            <div className="loading-bar" />
          </div>
          <section
            ref={el => {
              this.refresh = el;
            }}
          >
            {React.Children.map(this.props.children, childElement => {
              if (componentHasChild(childElement, ReactPullToRefreshWrapper)) {
                return React.cloneElement(childElement, {});
              }
              return childElement;
            })}
          </section>
        </div>
      </Fragment>
    );
  }
}

export default ReactPullToRefreshWrapper;
