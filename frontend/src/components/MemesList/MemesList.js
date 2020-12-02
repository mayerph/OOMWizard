import React from "react";
import { Rnd } from "react-rnd";
import { connect } from "react-redux";

import "./MemesList.css";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Button from "@material-ui/core/Button";
import { getApi } from "../../actions";

//Trying out the Grid List from Material UI (https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/grid-list/ImageGridList.js)
//DONE change state system to Redux
//TODO: remove the buttons, load data from other components/backend?, add passive information, add interaction for each image

class MemesList extends React.Component {
  onApiLoad() {
    this.props.getApi();
  }
  render() {
    return (
      <div className="root">
        <Button onClick={this.onApiLoad.bind(this)} variant="outlined">
          TempButton: LoadAPI
        </Button>

        <GridList cellHeight={500} className="gridList" cols={4}>
          {this.props.tileData.map((tile) => (
            <GridListTile key={tile.url} cols={tile.cols || 1}>
              <img src={tile.url} alt={tile.name} className="gridImg" />
              <GridListTileBar title={tile.name} />
            </GridListTile>
          ))}
        </GridList>
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

export default connect(mapStateToProps, { getApi })(MemesList);
