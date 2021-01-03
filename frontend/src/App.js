import React from 'react';
import './App.css';
import {Switch, Route, NavLink, Redirect} from "react-router-dom";
import {Test2} from "./components/Test/test2.component";
import {Test} from "./components/Test/test.component";
import { SharedMeme } from "./components/SharedMeme"
import { MainApp } from "./components/MainApp";


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={"/"} exact component={MainApp} />
        <Route path={"/test"} exact component={Test} />
        <Route path={"/test2"} exact component={Test2} />
        <Route path={"/meme/:id"} exact component={SharedMeme} />
      </Switch>
    </div>
  );
}

export default App;