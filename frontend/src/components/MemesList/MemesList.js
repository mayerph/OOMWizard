import React from "react";
import { Rnd } from "react-rnd";
import { connect } from "react-redux";

import "./MemesList.css";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import GetAppIcon from "@material-ui/icons/GetApp";
import ShareIcon from "@material-ui/icons/Share"

import { getApi } from "../../actions";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { EmailIcon, FacebookIcon, WhatsappIcon } from "react-share";
import { Share } from "../ShareDialog";

//Trying out the Grid List from Material UI (https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/grid-list/ImageGridList.js)
//DONE change state system to Redux
//TODO: remove the buttons, load data from other components/backend?, add passive information, add interaction for each image

class MemesList extends React.Component {
  onApiLoad() {
    this.props.getApi();
  }

  
  
  render() {
    function UserGreeting(props) {
      if (1 > 2) {
        return  <span>Welcome back!</span>;
      } else {
        return <span>Das ist einge Lüge</span>
      }     
    }

    let test = 1

    return (
      <div className="root">
        <UserGreeting></UserGreeting>
        <Share email="muste"></Share>
        <Button onClick={this.onApiLoad.bind(this)} variant="outlined">
          TempButton: LoadAPI
        </Button>

        <GridList cellHeight={500} className="gridList" cols={4}>
          {this.props.tileData.map((tile) => (
            <GridListTile key={tile.url} cols={tile.cols || 1}>
              <img src={tile.url} alt={tile.name} className="gridImg" />
              <GridListTileBar
                title={tile.name}
                subtitle={"likes: " + tile.name.length}
                actionIcon={
                  <div className="actionButtons">
                    <IconButton aria-label="upvote">
                      <ArrowUpwardIcon
                        style={{
                          color: "#fafafa",
                          fontSize: 15,
                          backgroundColor: "#388e3c",
                          borderRadius: 5,
                          padding: 2,
                        }}
                      />
                    </IconButton>
                    <IconButton aria-label="downvote">
                      <ArrowDownwardIcon
                        style={{
                          color: "#fafafa",
                          fontSize: 15,
                          backgroundColor: "#f4511e",
                          borderRadius: 5,
                          padding: 2,
                        }}
                      />
                    </IconButton>
                    <IconButton aria-label="download" href={tile.url} download>
                      <GetAppIcon
                        style={{
                          color: "#fafafa",
                          fontSize: 15,
                          backgroundColor: "#2196f3",
                          borderRadius: 5,
                          padding: 2,
                        }}
                      />
                    </IconButton>
                    <IconButton aria-label="share-btn">
                      <ShareIcon 
                        style={{
                          color: "#fafafa",
                          fontSize: 15,
                          backgroundColor: "#2196f3",
                          borderRadius: 5,
                          padding: 2,
                        }}
                      
                      />
                    </IconButton>
                    <WhatsappShareButton url={tile.url}>
                      <WhatsappIcon size={20} borderRadius={10} />
                    </WhatsappShareButton>
                    {/*                     <FacebookShareButton url={tile.url}>
                      <FacebookIcon size={35} borderRadius={10} />
                    </FacebookShareButton> */}
                  </div>
                }
              />
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
