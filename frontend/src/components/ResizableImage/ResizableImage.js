import React from 'react'
import './ResizableImage.css'
import { Rnd } from 'react-rnd'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { ContentState, EditorState } from 'draft-js'

class ResizableImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageWidth: this.props.width,
      imageHeight: this.props.height,
    }
  }

  handleRemoveImage(image) {
    this.props.dispatch({ type: 'REMOVE_ELEMENT', id: image.props.id })
  }

  handleUpdateImage(image, ref) {
    const canvas = document
      .getElementById('meme-canvas')
      .getBoundingClientRect()
    image.width = ref.offsetWidth
    image.height = ref.offsetHeight
    image.x = ref.getBoundingClientRect().left - canvas.left
    image.y = ref.getBoundingClientRect().top - canvas.top
    this.props.dispatch({
      type: 'UPDATE_ELEMENT',
      element: image,
      id: image.props.id,
    })
  }

  render() {
    return (
      <Rnd
        className="resizeable-image-container"
        id={'resizeable-image-' + this.props.id}
        default={{
          x: this.props.x,
          y: this.props.y,
        }}
        bounds={this.props.bounds}
        onResize={(e, direction, ref, delta, position) => {
          this.setState({
            imageWidth: ref.offsetWidth,
            imageHeight: ref.offsetHeight,
          })
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.handleUpdateImage(this, ref)
        }}
        onDragStop={(e, d) => {
          this.handleUpdateImage(this, d.node)
        }}
      >
        <IconButton
          color="secondary"
          aria-label="close"
          className="resizeable-image-container-close-button"
          onClick={() => this.handleRemoveImage(this)}
        >
          <CloseIcon />
        </IconButton>
        <img
          style={{
            pointerEvents: 'none',
            width: this.state.imageWidth,
            height: this.state.imageHeight,
          }}
          src={this.props.imageUrl}
        />
      </Rnd>
    )
  }
}

ResizableImage.propTypes = {}

ResizableImage.defaultProps = {}

export default connect()(ResizableImage)
