import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import "flexboxgrid/css/flexboxgrid.min.css";
import themeFile from "./utils/theme";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

import { setAuthorization } from "./helpers";

// For creating a material theme
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Components
import Navbar from "./components/common/Navbar";
import AuthRoute from "./components/common/AuthRoute";

// Pages
import Home from "./containers/home";
import Login from "./containers/login";
import Signup from "./containers/signup";
import Contact from "./containers/contact";

const theme = createMuiTheme(themeFile);

class App extends Component {
  componentDidMount() {
    setAuthorization(store);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <div className="container">
              <Navbar />
              <Switch>
                <AuthRoute path="/login" component={Login} />
                <AuthRoute path="/signup" component={Signup} />
                <AuthRoute path="/contact" component={Contact} />
                {/* exact does'nt work in cordova application <Route exact={true}  path="/" component={Home} /> */}
                <Route path="/" component={Home} />
              </Switch>
            </div>
          </BrowserRouter>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
