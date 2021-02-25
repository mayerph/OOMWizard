import React from 'react'
import './TextControl.css'
import Card from '@material-ui/core/Card'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlineIcon from '@material-ui/icons/FormatUnderlined'
import ColorizeIcon from '@material-ui/icons/Colorize'
import IconButton from '@material-ui/core/IconButton'
import { connect } from 'react-redux'
import ResizableText from '../ResizableText/ResizableText'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

class TextControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDialogOpened: false,
      memeTemplates: null,
    }
  }
  handleClose() {
    console.log('aa')
    this.setState({
      isDialogOpened: false,
    })
  }

  handleMemeCanvasDialogOpen() {
    fetch('http://localhost:2000/templates/')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isDialogOpened: true,
          memeTemplates: data,
        })
      })
  }

  memeCanvasDialog() {
    return (
      <Dialog
        onClose={() => this.handleClose()}
        open={this.state.isDialogOpened}
        aria-labelledby="login-form-title"
      >
        <DialogTitle id="login-form-title">Select template</DialogTitle>
        <DialogContent>
          {this.state.memeTemplates && this.templateList()}
        </DialogContent>
      </Dialog>
    )
  }

  canvasElementCounter = 0
  handleAddElement(type, url) {
    const element = {
      x: 0,
      y: 0,
      width: 400,
      bounds: '#meme-canvas',
      id: this.canvasElementCounter++,
      type: type,
      imageUrl: url,
    }
    this.props.dispatch({ type: 'ADD_ELEMENT', element: element })
  }

  templateList() {
    return (
      <div>
        {this.state.memeTemplates.map((template) => (
          <img
            key={template.id}
            className="meme-canvas-templates"
            src={'http://localhost:2000' + template.route}
            onClick={() => {
              this.handleAddElement(
                'image',
                'http://localhost:2000' + template.route,
              )
              this.handleClose()
            }}
          />
        ))}
      </div>
    )
  }

  applyStyle(style) {
    let newInlineStyles = this.props.inlineStyles
    if (typeof newInlineStyles !== 'undefined') {
      if (Object.keys(ResizableText.customStyleMap).includes(style)) {
        // remove all colors to ensure that there is only one color at anytime
        newInlineStyles = newInlineStyles.filter(
          (s) => !Object.keys(ResizableText.customStyleMap).includes(s),
        )
      }

      if (newInlineStyles.size === newInlineStyles.delete(style).size) {
        newInlineStyles = newInlineStyles.add(style)
      } else {
        newInlineStyles = newInlineStyles.delete(style)
      }
      this.props.dispatch({
        type: 'FOCUS_EDITOR_STATE',
        editorStateId: this.props.editorStateId,
        editorState: this.props.editorState,
        inlineStyles: newInlineStyles,
      })
    }
  }

  setFontSize(modifier) {
    const textContainer = document.getElementById(
      'resizeable-text-' + this.props.editorStateId,
    )
    if (!textContainer.style.fontSize) {
      textContainer.style.fontSize = getComputedStyle(
        document.querySelector('.resizeable-text-container'),
      ).fontSize
    }
    if (modifier === 'INCREASE_FONT') {
      const newFontSize = parseInt(textContainer.style.fontSize, 10) + 5
      if (newFontSize <= 65) {
        textContainer.style.fontSize = newFontSize.toString() + 'px'
      }
    } else if (modifier === 'DECREASE_FONT') {
      const newFontSize = parseInt(textContainer.style.fontSize, 10) - 5
      if (newFontSize >= 10) {
        textContainer.style.fontSize = newFontSize.toString() + 'px'
      }
    }
  }

  render() {
    if (this.props.initialImages && this.canvasElementCounter < 1) {
      this.props.initialImages.forEach((image) =>
        this.handleAddElement('image', image),
      )
    }

    let controlVisibility = this.props.editorState ? 1 : 0.2
    let isDisabled = !this.props.editorState

    return (
      <div>
        {this.memeCanvasDialog()}
        <Card className="text-control-card">
          <div style={{ opacity: controlVisibility }}>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.setFontSize('INCREASE_FONT')}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.setFontSize('DECREASE_FONT')}
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('BOLD')}
            >
              <FormatBoldIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('ITALIC')}
            >
              <FormatItalicIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('UNDERLINE')}
            >
              <FormatUnderlineIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('black')}
            >
              <ColorizeIcon
                style={{ color: ResizableText.customStyleMap.black.color }}
              />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('white')}
            >
              <ColorizeIcon style={{ color: 'rgba(0, 0, 0, 0.2)' }} />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('red')}
            >
              <ColorizeIcon
                style={{ color: ResizableText.customStyleMap.red.color }}
              />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('green')}
            >
              <ColorizeIcon
                style={{ color: ResizableText.customStyleMap.green.color }}
              />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('blue')}
            >
              <ColorizeIcon
                style={{ color: ResizableText.customStyleMap.blue.color }}
              />
            </IconButton>
          </div>
          <div>
            <Button
              style={{ margin: 5 }}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => this.handleMemeCanvasDialogOpen()}
            >
              Image
            </Button>
            <Button
              style={{ margin: 5 }}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => this.handleAddElement('text')}
            >
              Text
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}

TextControl.propTypes = {}

TextControl.defaultProps = {}

function mapStateToProps(state) {
  return {
    editorStateId: state.focusEditorState.editorStateId,
    editorState: state.focusEditorState.editorState,
    inlineStyles: state.focusEditorState.inlineStyles,
  }
}

export default connect(mapStateToProps)(TextControl)
