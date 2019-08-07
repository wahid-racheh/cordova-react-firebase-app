import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { isSmart } from "./utils/utility";
import * as serviceWorker from "./serviceWorker";
import { setServerRuntime, setServerOrigin } from "./helpers";

process.env.NODE_ENV === "production" &&
  setServerOrigin(process.env.REACT_APP_ORIGIN_SERVER);

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

if (isSmart()) {
  document.addEventListener(
    "deviceready",
    () => setServerRuntime(() => startApp(), () => window.location.reload()),
    false
  );
} else {
  startApp();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
