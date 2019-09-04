import React from "react";
import "./App.css";
import { HashRouter, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import PaperAWeekEntry from "./components/PaperReviews/PaperAWeekEntry";

function App() {
  fetch("/api")
    .then(response => response.json())
    .then(data => console.log(JSON.stringify(data)));
  return (
    <HashRouter>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/Form" component={PaperAWeekEntry} />
      </div>
    </HashRouter>
  );
}

export default App;
