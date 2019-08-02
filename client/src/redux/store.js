import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import userReducer from "./reducers/user.reducer";
import screamReducer from "./reducers/scream.reducer";
import uiReducer from "./reducers/ui.reducer";
import contactReducer from "./reducers/contact.reducer";

import api from "../api";

const initialState = {};

const logger = (/*store*/) => next => action => {
  if (typeof action !== "function") {
    console.log("dispatching : ", action);
  }
  return next(action);
};

const whatever = {};

const middleWare = [logger, thunk.withExtraArgument({ api, whatever })];

const reducers = combineReducers({
  user: userReducer,
  scream: screamReducer,
  UI: uiReducer,
  contact: contactReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(...middleWare))
);
/* eslint-enable */

export default store;
