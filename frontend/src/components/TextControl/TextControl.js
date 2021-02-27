import React from 'react'
import './TextControl.css'
import Card from '@material-ui/core/Card'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import ColorizeIcon from '@material-ui/icons/Colorize'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from '@material-ui/core/IconButton'
import { connect } from 'react-redux'
import ResizableText from '../ResizableText/ResizableText'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { ShareDialog } from '../ShareDialog'

class TextControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDialogOpened: false,
      memeTemplates: null,
      isImageGenerated: false,
      generatedImageUrl: null,
      promptShare: false,
    }
  }
  handleClose() {
    this.setState({
      isDialogOpened: false,
      isImageGenerated: false,
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
        maxWidth={'md'}
      >
        <DialogTitle id="login-form-title">Select Image Template</DialogTitle>
        <DialogContent style={{ backgroundColor: '#eeeeee' }}>
          {this.state.memeTemplates && this.templateList()}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.setState({ isDialogOpened: false })
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  downloadGeneratedImage() {
    const image = document.getElementById('generated-image')
    const saveImg = document.createElement('a')
    saveImg.href = image.src
    saveImg.download = 'meme.jpg'
    document.body.appendChild(saveImg)
    saveImg.click()
    document.body.removeChild(saveImg)
  }

  shareDialog() {
    return (
      <ShareDialog
        open={this.state.promptShare ? this.state.promptShare : false}
        onClose={() => {
          this.setState({ promptShare: false })
        }}
      />
    )
  }
  handleShare() {
    this.setState({ promptShare: true })
  }

  generatedImageDialog() {
    return (
      <Dialog
        onClose={() => this.handleClose()}
        open={this.state.isImageGenerated}
        aria-labelledby="login-form-title"
        maxWidth={false}
      >
        <DialogContent>
          <img id="generated-image" src={this.state.generatedImageUrl} />
        </DialogContent>
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DialogActions>
          <Button onClick={() => this.downloadGeneratedImage()} color="primary">
            Download
          </Button>
          <Button onClick={() => this.handleShare()} color="primary">
            Share
          </Button>
          <Button
            onClick={() => {
              this.setState({ isImageGenerated: false })
            }}
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
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

  handleGenerate() {
    const canvas = document
      .getElementById('meme-canvas')
      .getBoundingClientRect()
    const captions = []
    const images = []
    this.props.canvasElements.forEach((element) => {
      if (element.type === 'text') {
        const textElements = document.querySelectorAll(
          '#resizeable-text-' + element.id + ' span span',
        )
        const textElement = textElements[0]
        const text = [...textElements]
          .map((span) => span.textContent)
          .join('\n')

        captions.push({
          text: text,
          position: {
            x: textElement.getBoundingClientRect().left - canvas.left,
            y: textElement.getBoundingClientRect().top - canvas.top,
          },
          size: parseInt(
            window.getComputedStyle(textElement).fontSize.replace('px', ''),
          ),
          color: window.getComputedStyle(textElement).color,
          style: window.getComputedStyle(textElement).fontStyle,
          weight: window.getComputedStyle(textElement).fontWeight,
        })
      } else {
        const imageElement = document.querySelectorAll(
          '#resizeable-image-' + element.id + ' img',
        )[0]
        images.push({
          name: imageElement.src.split('/').pop(),
          position: {
            x: imageElement.getBoundingClientRect().left - canvas.left,
            y: imageElement.getBoundingClientRect().top - canvas.top,
          },
          width: imageElement.width,
          height: imageElement.height,
        })
      }
    })

    const postData = {
      memes: [
        {
          template: {
            name: 'Drake-Hotline-Bling.jpg',
            route: '/images/templates/Drake-Hotline-Bling.jpg',
            id: '5ff446fa4de819687770bfac',
          },
          captions: captions,
          images: images,
          canvas: {
            width: document.getElementById('meme-canvas').offsetWidth,
            height: document.getElementById('meme-canvas').offsetHeight,
          },
        },
      ],
    }
    console.log(postData)

    fetch('http://localhost:2000/memes/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.blob())
      .then((data) => {
        console.log('Success:', URL.createObjectURL(data))
        this.setState({
          generatedImageUrl: URL.createObjectURL(data),
          isImageGenerated: true,
        })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
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
      if (newFontSize <= 300) {
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
        {this.generatedImageDialog()}
        {this.shareDialog()}
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
              Image Template
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
            <Button
              style={{ margin: 5 }}
              variant="contained"
              color="secondary"
              startIcon={<SettingsIcon />}
              onClick={() => this.handleGenerate()}
            >
              Generate
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
    canvasElements: state.canvasElements,
  }
}

export default connect(mapStateToProps)(TextControl)
