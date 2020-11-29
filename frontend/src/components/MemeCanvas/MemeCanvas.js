import React from 'react';
import PropTypes from 'prop-types';
import './MemeCanvas.css';
import {Rnd} from "react-rnd";
import Card from '@material-ui/core/Card';
import ResizableImage from "../ResizableImage/ResizableImage";

class MemeCanvas extends React.Component {
    render() {
        const memeCanvasId = "meme-canvas"
        return (
            <div>
                <Rnd
                    id={memeCanvasId}
                    default={{
                        x: 0,
                        y: 0,
                        width: 500,
                        height: 500,

                    }}
                    minWidth='500px'
                    minHeight='500px'
                    bounds='#meme-canvas-container'
                    disableDragging
                >
                    <Card id="meme-canvas-card">
                        <ResizableImage x={0} y={0} width={100} height={200} bounds={'#' + memeCanvasId}/>
                    </Card>
                </Rnd>
            </div>
        );
    }
}

MemeCanvas.propTypes = {};

MemeCanvas.defaultProps = {};

export default MemeCanvas;
