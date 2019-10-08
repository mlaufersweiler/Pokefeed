import React from "react";
import { Switch, Route } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Register from "./Components/Register/Register";
export default (
  <Switch>
    <Route path="/" exact component={Landing} />
    <Route path="/register" component={Register} />
  </Switch>
);
