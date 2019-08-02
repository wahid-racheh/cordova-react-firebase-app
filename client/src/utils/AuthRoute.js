import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthGuardWrapper from "./AuthGuardWrapper";

const AUTH_ROUTES = ["/login", "/signup"];

function isAuthRoute(path) {
  return AUTH_ROUTES.includes(path);
}

const AuthRoute = ({ component: Component, path, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return (
        <AuthGuardWrapper>
          <AuthGuardWrapper.On>
            <Component {...props} />
          </AuthGuardWrapper.On>
          <AuthGuardWrapper.Off>
            {isAuthRoute(path) ? <Component {...props} /> : <Redirect to="/" />}
          </AuthGuardWrapper.Off>
        </AuthGuardWrapper>
      );
    }}
  />
);

export default AuthRoute;
