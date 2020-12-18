import React from 'react';
import './MemeCanvas.css';
import {Rnd} from "react-rnd";
import Card from '@material-ui/core/Card';
import ResizableImage from "../ResizableImage/ResizableImage";
import ResizableText from "../ResizableText/ResizableText";
import {connect} from "react-redux";

class MemeCanvas extends React.Component {
    handleUnfocusText(e) {
        if (e.target.id === 'meme-canvas-card' || e.target.classList.contains("resizeable-image-container")) {
            this.props.dispatch({type: 'UNFOCUS_EDITOR_STATE'})
        }
    }

    render() {
        const canvasElements = this.props.canvasElements.map(renderElement)

        function renderElement(element) {
            if (element.type === "image") {
                return (
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
            if (element.type === "text") {
                return (
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
                    onClick={(e) => this.handleUnfocusText(e)}
                    resizeHandleClasses={{
                        bottomLeft: 'resize-handle-bottom-left',
                        bottomRight: 'resize-handle-bottom-right',
                        topLeft: 'resize-handle-top-left',
                        topRight: 'resize-handle-top-right',
                    }}
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
        canvasElements: [...state.canvasElements],
        editorState: state.focusEditorState.editorState,
    }
}


export default connect(mapStateToProps)(MemeCanvas);
