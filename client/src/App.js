import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import TopBar from "./components/TopBar";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Blog from "./pages/Blog";

export default function App() {
  return (
    <div>
      <Router>
        <TopBar />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/blog">
            <Blog />
          </Route>
          <Route path="/test">
            <Test />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function Test() {
  return (
    <div>
      <h1>Test</h1>
    </div>
  )
}