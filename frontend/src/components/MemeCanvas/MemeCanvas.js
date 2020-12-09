import React from 'react';
import './MemeCanvas.css';
import {Rnd} from "react-rnd";
import Card from '@material-ui/core/Card';
import ResizableImage from "../ResizableImage/ResizableImage";
import ResizableText from "../ResizableText/ResizableText";
import {connect} from "react-redux";

class MemeCanvas extends React.Component {
    render() {
        const canvasElements = this.props.canvasElements.map(renderElement)

        function renderElement(element){
            if (element.type === "image"){
                return(
                    <ResizableImage
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        imageUrl={element.imageUrl}
                        width={element.width}
                        height={element.height}
                        bounds={element.bounds}
                        id={element.id}
                    />
                )
            }
            if (element.type === "text"){
                return(
                    <ResizableText
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        bounds={element.bounds}
                        id={element.id}
                    />
                )
            }

        }

        return (
            <div>
                <Rnd
                    id="meme-canvas"
                    default={{
                        x: 0,
                        y: 0,
                        height: 500,

                    }}
                    minWidth='500px'
                    minHeight='500px'
                    bounds='#meme-canvas-container'
                    disableDragging
                >
                    <Card id="meme-canvas-card">
                        {canvasElements}
                    </Card>
                </Rnd>
            </div>
        );
    }
}

MemeCanvas.propTypes = {};
MemeCanvas.defaultProps = {};

function mapStateToProps(state) {
    return {
        canvasElements: [...state.canvasElements]
    }
}


export default connect(mapStateToProps)(MemeCanvas);