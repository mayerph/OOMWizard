import React from "react";
import "./App.css";
import { NavBar } from "../NavBar";
import { MemeCanvas } from "../MemeCanvas";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

import { MemesList } from "../MemesList";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Grid container>
          <Grid item xs />
          <Grid item id="meme-canvas-container">
            <Grid item container>
              <Grid item xs />
              <Grid item xs>
                <MemeCanvas />
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>

          <Grid item id="memes-list-container">
            <Grid item xs>
              <MemesList />
            </Grid>
          </Grid>
          <Grid item xs />
        </Grid>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
