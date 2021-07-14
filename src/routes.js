import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Layout from "./pages/layout";
import Login from "./pages/Login";
import CreateUser from "./pages/CreateUser";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Payments from "./pages/Payments";
import { getToken } from "./services/auth";

const isAuthenticated = () => {
  const token = getToken();
  if (token === null) return false;
  try {
    const { exp } = jwtDecode(token);
    const expDate = new Date(exp * 1000).getTime();
    const nowDate = new Date().getTime();
    return nowDate < expDate;
  } catch (err) {
    return false;
  }
};

const PrivateRoute = ({ component: Component, title, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Layout>
          <Component {...props} />
        </Layout>
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={(props) => (
          <Layout>
            <Login />
          </Layout>
        )}
      />

      <Route
        exact
        path="/login"
        render={(props) => (
          <Layout>
            <Login />
          </Layout>
        )}
      />

      <Route
        exact
        path="/create-user"
        render={(props) => (
          <Layout>
            <CreateUser />
          </Layout>
        )}
      />

      <PrivateRoute
        exact
        path="/transactions"
        title="Transações"
        component={Transactions}
      />

      <PrivateRoute
        exact
        path="/categories"
        title="Categorias"
        component={Categories}
      />

      <PrivateRoute
        exact
        path="/payments"
        title="Pagamentos"
        component={Payments}
      />
    </Switch>
  </HashRouter>
);

export default Routes;
