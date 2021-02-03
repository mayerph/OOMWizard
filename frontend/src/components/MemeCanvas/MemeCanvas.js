import React from 'react'
import './MemeCanvas.css'
import { Rnd } from 'react-rnd'
import Card from '@material-ui/core/Card'
import ResizableImage from '../ResizableImage/ResizableImage'
import ResizableText from '../ResizableText/ResizableText'
import { connect } from 'react-redux'
import TextControl from '../TextControl/TextControl'
import Grid from '@material-ui/core/Grid'

class MemeCanvas extends React.Component {
  handleUnfocusText(e) {
    if (
      e.target.id === 'meme-canvas-card' ||
      e.target.classList.contains('resizeable-image-container')
    ) {
      this.props.dispatch({ type: 'UNFOCUS_EDITOR_STATE' })
    }
  }

  render() {
    const canvasElements = this.props.canvasElements.map(renderElement)
    function renderElement(element) {
      if (element.type === 'image') {
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
      if (element.type === 'text') {
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
      <Grid container>
        <Grid item container direction="row">
          <Grid item id="meme-canvas-text-control-container">
            <TextControl
              initialImage={
                this.props.location.state && this.props.location.state.imageUrl
              }
            />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item container id="meme-canvas-container">
            <Rnd
              id="meme-canvas"
              default={{
                x: 0,
                y: 0,
                height: 500,
              }}
              minWidth="500px"
              minHeight="500px"
              bounds="#meme-canvas-container"
              disableDragging
              onClick={(e) => this.handleUnfocusText(e)}
              resizeHandleClasses={{
                bottomLeft: 'resize-handle-bottom-left',
                bottomRight: 'resize-handle-bottom-right',
                topLeft: 'resize-handle-top-left',
                topRight: 'resize-handle-top-right',
              }}
            >
              <Card id="meme-canvas-card">{canvasElements}</Card>
            </Rnd>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

MemeCanvas.defaultProps = {}

/**
 * As the first argument passed in to connect, mapStateToProps is used for selecting the part
 * of the data from the store that the connected component needs
 */
function mapStateToProps(state) {
  return {
    canvasElements: [...state.canvasElements],
    editorState: state.focusEditorState.editorState,
  }
}

export default connect(mapStateToProps)(MemeCanvas)
