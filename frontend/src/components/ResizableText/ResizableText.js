import React from 'react'
import './ResizableText.css'
import { Rnd } from 'react-rnd'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import {
  Editor,
  EditorState,
  Modifier,
  ContentState,
  convertToRaw,
} from 'draft-js'

class ResizableText extends React.Component {
  constructor(props) {
    super(props)
    const initialContent = ContentState.createFromText('Enter Text')
    this.state = {
      editorState: EditorState.createWithContent(initialContent),
      disableDragging: false,
    }
    this.onChange = (editorState) => this.setState({ editorState })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.editorStateId === this.props.id) {
      if (
        typeof this.props.editorState !== 'undefined' &&
        typeof prevProps.editorState !== 'undefined' &&
        !this.props.inlineStyles.equals(prevProps.inlineStyles)
      ) {
        let currentContent = prevState.editorState.getCurrentContent()

        // Remove old inline styles
        for (let style of prevState.editorState.getCurrentInlineStyle()) {
          const selection = prevState.editorState.getSelection()
          currentContent = Modifier.removeInlineStyle(
            currentContent,
            selection,
            style,
          )
        }

        let editorState = EditorState.push(
          this.props.editorState,
          currentContent,
          'change-inline-style',
        )
        // add new inline styles
        for (let style of this.props.inlineStyles) {
          const selection = editorState.getSelection().merge({
            anchorKey: currentContent.getFirstBlock().getKey(),
            anchorOffset: 0,
            focusOffset: currentContent.getLastBlock().getText().length,
            focusKey: currentContent.getLastBlock().getKey(),
          })
          currentContent = Modifier.applyInlineStyle(
            currentContent,
            selection,
            style,
          )
          editorState = EditorState.push(
            editorState,
            currentContent,
            'change-inline-style',
          )
        }
        this.setState({ editorState: editorState })
      }
    }
  }

  handleRemoveText(e, text) {
    this.props.dispatch({ type: 'REMOVE_ELEMENT', id: text.props.id })
    this.props.dispatch({ type: 'UNFOCUS_EDITOR_STATE' })
  }

  handleUpdateText(text, ref) {
    const canvas = document
      .getElementById('meme-canvas')
      .getBoundingClientRect()
    text.width = ref.getBoundingClientRect().width
    text.height = ref.getBoundingClientRect().height
    text.x = ref.getBoundingClientRect().left - canvas.left
    text.y = ref.getBoundingClientRect().top - canvas.top
    this.props.dispatch({
      type: 'UPDATE_ELEMENT',
      element: text,
      id: text.props.id,
    })
  }

  changeFocus(e, editorState) {
    // && convertToRaw(editorState.getCurrentContent()).blocks[0].text === "Enter Text"
    if (e.target.tagName === 'SPAN') {
      this.setState({ disableDragging: true })
    } else {
      this.setState({ disableDragging: false })
    }
    if (e.target.tagName !== 'path' && e.target.tagName !== 'svg') {
      this.props.dispatch({
        editorStateId: this.props.id,
        type: 'FOCUS_EDITOR_STATE',
        editorState: editorState,
        inlineStyles: editorState.getCurrentInlineStyle(),
      })
    }
  }

  render() {
    let focusedBorderColor =
      this.props.id === this.props.editorStateId ? 'red' : 'inherit'
    let cursor = this.state.disableDragging ? 'text' : 'move'
    let focusedTextBorderColor = this.state.disableDragging
      ? 'blue'
      : 'rgba(0,0,0,0)'
    return (
      <Rnd
        style={{
          borderColor: focusedBorderColor,
        }}
        className="resizeable-text-container"
        id={'resizeable-text-' + this.props.id}
        default={{
          x: this.props.x,
          y: this.props.y,
          width: this.props.width,
          height: this.props.height,
        }}
        bounds={this.props.bounds}
        onClick={(e) => this.changeFocus(e, this.state.editorState)}
        disableDragging={this.state.disableDragging}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.handleUpdateText(this, ref)
        }}
        onDragStop={(e, d) => {
          this.handleUpdateText(this, d.node)
        }}
      >
        <div
          style={{
            cursor: cursor,
            borderColor: focusedTextBorderColor,
            borderWidth: 1,
            borderStyle: 'dotted',
            padding: 10,
          }}
        >
          <Editor
            editorState={this.state.editorState}
            customStyleMap={ResizableText.customStyleMap}
            onChange={this.onChange}
            style={{
              cursor: cursor,
            }}
            id="editortextfield"
          />
        </div>
        <IconButton
          color="secondary"
          aria-label="close"
          className="resizeable-text-container-close-button"
          onClick={(e) => this.handleRemoveText(e, this)}
        >
          <CloseIcon />
        </IconButton>
      </Rnd>
    )
  }
}

ResizableText.propTypes = {}

ResizableText.defaultProps = {}

ResizableText.customStyleMap = {
  black: {
    color: 'rgba(0, 0, 0, 1.0)',
  },
  white: {
    color: 'rgba(255, 255, 255, 1.0)',
  },
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
}

function mapStateToProps(state) {
  return {
    editorStateId: state.focusEditorState.editorStateId,
    editorState: state.focusEditorState.editorState,
    inlineStyles: state.focusEditorState.inlineStyles,
  }
}

export default connect(mapStateToProps)(ResizableText)
