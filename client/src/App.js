import React from "react";
import "./App.css";
import { HashRouter, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import ReviewForm from "./components/ReviewForm/ReviewForm";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/Form" component={ReviewForm} />
      </div>
    </HashRouter>
  );
}

export default App;
