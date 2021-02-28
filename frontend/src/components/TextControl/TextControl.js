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
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { ShareDialog } from '../ShareDialog'
import Tooltip from '@material-ui/core/Tooltip'
import html2canvas from 'html2canvas'
import {
  speechtocontrolmultiple,
  speechtotextcanvas,
} from '../speechtotext/speechtotext.js'
import MicIcon from '@material-ui/icons/Mic'
import Chip from '@material-ui/core/Chip'

import * as config from '../../config.json'
import Fade from '@material-ui/core/Fade'

const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

class TextControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDialogOpened: false,
      memeTemplates: null,
      isImageGenerated: false,
      generatedImageUrl: null,
      generatedMeme: null,
      isShareDialogOpened: false,
      isGenerateDialogOpened: false,
      generateMethod: 'backend',
      generateAccess: 'public',
      generateMaxSize: 0,
      foundBlob: false,
    }
  }
  handleClose() {
    this.setState({
      isDialogOpened: false,
      isImageGenerated: false,
      isGenerateDialogOpened: false,
    })
  }

  handleMemeCanvasDialogOpen() {
    fetch(`${backend_uri}/templates/`, {
      credentials: 'include',
    })
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
    saveImg.target = '_blank'
    document.body.appendChild(saveImg)
    saveImg.click()
    document.body.removeChild(saveImg)
  }

  shareDialog() {
    return (
      <ShareDialog
        open={
          this.state.isShareDialogOpened
            ? this.state.isShareDialogOpened
            : false
        }
        meme={this.state.generatedMeme}
        onClose={() => {
          this.setState({ isShareDialogOpened: false })
        }}
      />
    )
  }
  handleShare() {
    this.setState({ isShareDialogOpened: true })
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
          {this.state.generateMethod === 'backend' && (
            <Button onClick={() => this.handleShare()} color="primary">
              Share
            </Button>
          )}
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

  generateDialog() {
    return (
      <Dialog
        onClose={() => this.handleClose()}
        open={this.state.isGenerateDialogOpened}
        aria-labelledby="login-form-title"
        maxWidth={false}
      >
        <DialogTitle>Generate Meme</DialogTitle>

        <DialogContent>
          <FormControl>
            <FormLabel className={'generate-form-label'} component="legend">
              Generation Method
            </FormLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.generateMethod}
              onChange={(event) => {
                this.setState({ generateMethod: event.target.value })
              }}
            >
              <MenuItem value={'backend'}>Backend Generation</MenuItem>
              <MenuItem value={'frontend'}>Frontend Generation</MenuItem>
            </Select>
            <FormLabel className={'generate-form-label'}>
              Maximum Image Size (KB)
            </FormLabel>
            <TextField
              id="max-size"
              type="number"
              disabled={this.state.generateMethod === 'backend'}
              value={this.state.generateMaxSize}
              onChange={(event) => {
                if (Number.isInteger(parseInt(event.target.value))) {
                  console.log(event.target.value)
                  let newValue
                  if (event.target.value.length !== 1) {
                    newValue = event.target.value.replace(/^0+/, '')
                  } else {
                    newValue = event.target.value
                  }
                  this.setState({
                    generateMaxSize: newValue,
                  })
                }
              }}
              helperText="0 to ignore Maximum Image Size"
            />
            <FormLabel className={'generate-form-label'} component="legend">
              Access
            </FormLabel>
            <RadioGroup
              aria-label="access-control"
              style={{ display: 'inline' }}
              name="Access"
              value={this.state.generateAccess}
              onChange={(event) => {
                this.setState({ generateAccess: event.target.value })
              }}
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="Public"
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="Private"
              />
              <FormControlLabel
                value="unlisted"
                control={<Radio />}
                label="Unlisted"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.generateMeme()} color="primary">
            Generate
          </Button>
          <Button
            onClick={() => {
              this.setState({ isGenerateDialogOpened: false })
            }}
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  generateMeme() {
    if (this.state.generateMethod === 'backend') {
      this.backendGeneration()
    } else {
      this.frontendGeneration()
    }
  }

  createBlobWithMaxFileSize(canvas) {
    let blobSize = 0
    if (this.state.generateMaxSize !== 0) {
      this.setState({
        foundBlob: false,
      })
      for (let i = 10; i > -1; i--) {
        canvas.toBlob(
          (blob) => {
            blobSize = Math.ceil(blob.size / 1024)
            if (
              !this.state.foundBlob &&
              blobSize < this.state.generateMaxSize
            ) {
              this.setState({ foundBlob: blob })
              console.log(blobSize)
              console.log('found')
              this.setState({
                generatedImageUrl: URL.createObjectURL(blob),
                isImageGenerated: true,
                foundBlob: true,
              })
            }
            if (i === 0 && this.state.foundBlob === false) {
              canvas.toBlob(
                (blob) => {
                  this.setState({ foundBlob: blob })
                  console.log(blobSize)
                  console.log('found2')
                  this.setState({
                    generatedImageUrl: URL.createObjectURL(blob),
                    isImageGenerated: true,
                    foundBlob: true,
                  })
                },
                'image/jpeg',
                0,
              )
            }
          },
          'image/jpeg',
          i * 0.1,
        )
      }
    } else {
      canvas.toBlob(
        (blob) => {
          console.log('found3')
          this.setState({
            generatedImageUrl: URL.createObjectURL(blob),
            isImageGenerated: true,
            foundBlob: true,
          })
        },
        'image/jpeg',
        1,
      )
    }
  }

  frontendGeneration() {
    // Don't include borders to image
    document.querySelectorAll('.resizeable-text-container').forEach((node) => {
      node.style.borderWidth = 0
    })
    document.querySelectorAll('.resizeable-image-container').forEach((node) => {
      node.style.borderWidth = 0
    })

    // Convert images to blobs to make html2canvas work
    const canvasImages = document.querySelectorAll('img')
    if (canvasImages.length > 0) {
      const imgSrcs = []
      let imgProccesed = 0
      canvasImages.forEach((img) => {
        let imgSrc = img.src
        imgSrcs.push(imgSrc)
        fetch(img.src)
          .then((response) => {
            return response.blob()
          })
          .then((blob) => {
            img.src = URL.createObjectURL(blob)
            imgProccesed = imgProccesed + 1
            if (imgProccesed === canvasImages.length) {
              html2canvas(document.querySelector('#meme-canvas-card'), {
                allowTaint: true,
              }).then((canvas) => {
                canvasImages.forEach((img, i) => {
                  img.src = imgSrcs[i]
                })
                this.createBlobWithMaxFileSize(canvas)
              })
              document
                .querySelectorAll('.resizeable-text-container')
                .forEach((node) => {
                  node.style.borderWidth = '1px'
                })
              document
                .querySelectorAll('.resizeable-image-container')
                .forEach((node) => {
                  node.style.borderWidth = '1px'
                })
            }
          })
      })

      // Text only memes
    } else {
      html2canvas(document.querySelector('#meme-canvas-card'), {
        allowTaint: true,
      }).then((canvas) => {
        this.createBlobWithMaxFileSize(canvas)
      })
      document
        .querySelectorAll('.resizeable-text-container')
        .forEach((node) => {
          node.style.borderWidth = '1px'
        })
    }
  }

  handleAddElement(type, url) {
    const element = {
      x: 0,
      y: 0,
      width: type === 'image' ? 400 : 200,
      bounds: '#meme-canvas',
      type: type,
      imageUrl: url,
    }
    this.props.dispatch({ type: 'ADD_ELEMENT', element: element })
  }

  backendGeneration() {
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
      memes: {
        template: {
          name: 'Drake-Hotline-Bling.jpg',
          route: '/images/templates/Drake-Hotline-Bling.jpg',
          id: '5ff446fa4de819687770bfac',
        },
        captions: captions,
        images: images,
        access: this.state.generateAccess,
        canvas: {
          width: document.getElementById('meme-canvas').offsetWidth,
          height: document.getElementById('meme-canvas').offsetHeight,
        },
      },
    }
    console.log(postData)

    fetch(`${backend_uri}/memes/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
        this.setState({
          generatedImageUrl: `${backend_uri}` + data.route,
          generatedMeme: data,
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
            src={`${backend_uri}` + template.route}
            onClick={() => {
              this.handleAddElement('image', `${backend_uri}` + template.route)
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
  chipTooltip() {
    return (
      <div className={'text-control-chips'}>
        <Chip icon={<MicIcon />} label="add image" color="secondary" />
        <Chip icon={<MicIcon />} label="add text" color="secondary" />
        <Chip icon={<MicIcon />} label="generate" color="secondary" />
        <Chip icon={<MicIcon />} label="make text bigger" color="secondary" />
        <Chip icon={<MicIcon />} label="make text bold" color="secondary" />
        <Chip icon={<MicIcon />} label="make text italic" color="secondary" />
        <Chip icon={<MicIcon />} label="make text black" color="secondary" />
        <Chip icon={<MicIcon />} label="make text white" color="secondary" />
        <Chip icon={<MicIcon />} label="make text red" color="secondary" />
        <Chip icon={<MicIcon />} label="make text green" color="secondary" />
        <Chip icon={<MicIcon />} label="make text blue" color="secondary" />
        <Chip icon={<MicIcon />} label="make text smaller" color="secondary" />
      </div>
    )
  }

  render() {
    let controlVisibility = this.props.editorState ? 1 : 0.2
    let isDisabled = !this.props.editorState
    let trying = false

    return (
      <div>
        {this.memeCanvasDialog()}
        {this.generatedImageDialog()}
        {this.shareDialog()}
        {this.generateDialog()}
        <Card className="text-control-card">
          <div style={{ opacity: controlVisibility }}>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.setFontSize('INCREASE_FONT')}
              id="canvasincreasefont"
            >
              <AddIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.setFontSize('DECREASE_FONT')}
              id="canvasdecreasefont"
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('BOLD')}
              id="canvasboldfont"
            >
              <FormatBoldIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('ITALIC')}
              id="canvasitalicfont"
            >
              <FormatItalicIcon />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('black')}
              id="canvasblackfont"
            >
              <ColorizeIcon
                style={{ color: ResizableText.customStyleMap.black.color }}
              />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('white')}
              id="canvaswhitefont"
            >
              <ColorizeIcon style={{ color: 'rgba(0, 0, 0, 0.2)' }} />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('red')}
              id="canvasredfont"
            >
              <ColorizeIcon
                style={{ color: ResizableText.customStyleMap.red.color }}
              />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('green')}
              id="canvasgreenfont"
            >
              <ColorizeIcon
                style={{ color: ResizableText.customStyleMap.green.color }}
              />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => this.applyStyle('blue')}
              id="canvasbluefont"
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
              id="canvasaddimage"
            >
              Image Template
            </Button>
            <Button
              style={{ margin: 5 }}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => this.handleAddElement('text')}
              id="canvasaddtext"
            >
              Text
            </Button>
            <Button
              style={{ margin: 5 }}
              variant="contained"
              color="secondary"
              startIcon={<SettingsIcon />}
              onClick={() => {
                this.setState({ isGenerateDialogOpened: true })
              }}
              id="canvasgenfront"
            >
              Generate
            </Button>
            <Chip
              avatar={
                <IconButton variant="contained" color="primary">
                  <MicIcon />
                </IconButton>
              }
              label="Dictate Caption"
              clickable
              color="primary"
              onClick={() => {
                speechtotextcanvas(trying)
                trying = !trying
              }}
            />
            <Tooltip TransitionComponent={Fade} title={this.chipTooltip()}>
              <Chip
                avatar={
                  <IconButton variant="contained" color="secondary">
                    <MicIcon />
                  </IconButton>
                }
                label="Dictate Action"
                clickable
                color="secondary"
                onClick={() => {
                  speechtocontrolmultiple(
                    [
                      'canvasaddimage',
                      'canvasaddtext',
                      'canvasgenfront',
                      'canvasincreasefont',
                      'canvasdecreasefont',
                      'canvasboldfont',
                      'canvasitalicfont',
                      'canvasblackfont',
                      'canvaswhitefont',
                      'canvasredfont',
                      'canvasgreenfont',
                      'canvasbluefont',
                    ],
                    [
                      'add image',
                      'add text',
                      'generate',
                      'make text bigger',
                      'make text smaller',
                      'make text bold',
                      'make text italic',
                      'make text black',
                      'make text white',
                      'make text red',
                      'make text green',
                      'make text blue',
                    ],
                  )
                }}
              />
            </Tooltip>
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
