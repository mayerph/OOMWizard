import React from "react";
import { Rnd } from "react-rnd";
import { connect } from "react-redux";

import "./MemeSlideShow.css";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Button from "@material-ui/core/Button";
import { getApi } from "../../actions";

import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";

class MemeSlideShow extends React.Component {
  onApiLoad() {
    this.props.getApi();
  }

  render() {
    return (
      <div className="root">
        {/* <Button onClick={this.onApiLoad.bind(this)} variant="outlined">
          TempButton: LoadAPI
        </Button> */}

        <Carousel interval="10000" navButtonsAlwaysVisible="true">
          {this.props.tileData.map((tile) => (
            <Paper>
              <h2>{tile.name}</h2>
              <img src={tile.url} alt={tile.name} className="slideImage" />
            </Paper>
          ))}
        </Carousel>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  //console.log(state.api.tileData);
  return {
    tileData: state.api.tileData,
  };
};

export default connect(mapStateToProps, { getApi })(MemeSlideShow);
