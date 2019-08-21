import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";

import api from "../api";
import mocks from "../mocks";

const initialState = {};

const logger = (/*store*/) => next => action => {
  if (typeof action !== "function") {
    console.log("dispatching : ", action);
  }
  return next(action);
};

const middleWare = [logger, thunk.withExtraArgument({ api, mocks })];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(...middleWare))
);
/* eslint-enable */

export default store;
